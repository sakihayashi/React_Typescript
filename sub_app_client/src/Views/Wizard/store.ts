import LocaleStore from '@otosense/locale';
import {DataChannel} from '@otosense/multi-time-vis';
import * as _ from 'lodash';
import {action, computed, IObservableArray, makeObservable, observable} from 'mobx';
import apiRequest, {
  APIS,
  ChannelScores,
  FeedbackEnum,
  IResultsData,
  PhaseResults,
  TrainingResults,
} from "../../api";
import AppState, {View as AppView} from "../../appState";
import AssetTypeStore from "../../assetTypeStore";
import {RESERVED_ANNOTATION_KEYS} from "../../constants";
import {DppSessionsStore} from ".";

export interface Filters {
  startBt?: number;
  endBt?: number;
  assetsFilter?: {
    asset_instance?: string;
    asset_type?: string;
    asset_variant?: string;
  };
  qualityThreshold?: number;
  underScoreFilter?: boolean;
  feedback?: FeedbackEnum;
  retrieveSensorData?: boolean;
}

export interface OutlierModel {
  id?: string;

  [fieldName: string]: any;
}
export interface PlcKeys {
  [plcTagName: string]: string[] | number[] | string | number;
}

export interface SettingNames {
  sessionPercentage: number;
  nOfFeatures: number;
  nOfCentroids: number;
}

export const CENTROID_SMOOTHING: string = 'CentroidSmoothing';
export const OUTLIER_MODEL: string = 'OutlierModel';

export enum View {
  SELECT_PIPELINE,
  SELECT_SESSIONS,
  PHASE_DEFINITIONS,
  TRAINING_SETTINGS,
  REVIEW_RESULTS,
  CLOSE_ADD_NEW,
}

export interface PLCKey {
  example: string | number;
  tag: string;
  type: 'string' | 'number';
}

export type UniversalComparisonOperator = '==' | '!=';
export type NumericComparisonOperator = UniversalComparisonOperator | '>' | '<';
export type StringComparisonOperator =
  UniversalComparisonOperator
  | 'contains'
  | 'startswith'
  | 'endswith';
export type ComparisonOperator = NumericComparisonOperator | StringComparisonOperator;

export const COMPARISON_LABELS = {
  '==': 'comparison.equalTo',
  // eslint-disable-next-line
  '!=': 'comparison.notEqualTo',
  '<': 'comparison.lessThan',
  '>': 'comparison.greaterThan',
  'contains': 'comparison.contains',
  'startswith': 'comparison.startsWith',
  'endswith': 'comparison.endsWith',
};

export interface PhaseParameter {
  tag: string;
  operator: ComparisonOperator;
  value: string | number;
}

const DEFAULT_PHASE_PARAMETER = {
  tag: '',
  // eslint-disable-next-line
  operator: '==' as ComparisonOperator,
  value: '',
};

export const rowsPerPage = 10;


function displayApiError(
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDescriptor.value;

  propertyDescriptor.value = function (...args: any[]) {
    return method.apply(this, args)
    .then((apiResult: any) => {
      if (apiResult?.error) {
        this.errorMsg = apiResult.error;
        this.apiErrorDialog = true;
        console.error(propertyName, 'Error:', apiResult.error);
      }
      return apiResult;
    });
  };
  return propertyDescriptor;
}

function stepBackOnError(
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDescriptor.value;

  propertyDescriptor.value = function (...args: any[]) {
    return method.apply(this, args)
    .then((apiResult) => {
      if (apiResult?.error) {
        this.step = this.step - 1;
      }
      return apiResult;
    });
  };
  return propertyDescriptor;
}

export default class WizardStore {

  @observable step: number = View.SELECT_PIPELINE;
  @observable filterStartDate: number = null;
  @observable filterEndDate: number = null;
  @observable filterScore: number = null;
  @observable filterUnderScore: boolean = false;
  @observable filterFeedback: FeedbackEnum = FeedbackEnum.UNSET;
  @observable phases: IObservableArray<PhaseParameter[]> = observable.array([]);
  @observable availableKeys: IObservableArray<PLCKey> = observable.array([]);
  @observable selectedPhaseIndex: number = 0;
  @observable sessionPercentage: number = 58;
  @observable nOfFeatures: number = 56;
  @observable nOfCentroids: number = 23;
  @observable nextBtnState: boolean = true;
  @observable backBtnState: boolean = false;
  @observable selectedSessions: IObservableArray<number> = observable.array([]);
  @observable chunkScoreAggMethod: string = 'mean';
  @observable phaseScoreAggMethod: string = 'mean';
  @observable channelScoreAggMethod: string = 'mean';
  @observable percentileVals: IObservableArray<number> = observable.array([5, 95]);
  @observable phaseNum: number = 1;
  // @observable sessionNum: number[] = [];
  @observable sessionNChunkScore: number = 1;
  @observable numsOutlinerScore: number[] = [1, 1];
  @observable totalFilteredSessions: number = 0;
  @observable isLastStep: boolean = false;
  @observable isDppSaved: boolean = false;
  @observable apiErrorDialog: boolean = false;
  // training results
  @observable trainingResults: TrainingResults = null;
  @observable trainingSessionMap = null;
  @observable trainingPhaseMap: string[] | number[] = null;
  @observable trainingChannelMap = null;
  @observable selectedTrainingSessionIdx = 0;
  @observable selectedTrainingPhaseIdx = 0;
  @observable errorMsg: string = '';
  // temporal
  @observable plcTags: any = null;

  // @observable selectedSessionIds: IObservableArray<string> = observable.array([]);
  // api: ApiV3;
  appState: AppState;
  dppSessionStore: DppSessionsStore;
  assetTypeStore: AssetTypeStore;

  locale: LocaleStore;

  constructor(
    appState: AppState,
    locale: LocaleStore,
    assetTypeStore: AssetTypeStore,
    dppSessionStore: DppSessionsStore) {
    makeObservable(this);
    this.appState = appState;
    this.dppSessionStore = dppSessionStore;
    this.assetTypeStore = assetTypeStore;
    this.locale = locale;
    window['modelStore'] = this;
  }

  @action.bound nextStep(): void {
    if (this.step === View.REVIEW_RESULTS) {
      this.saveDppBuild(); // Save dpp on last step
      this.isLastStep = true;
      // this.nextBtnState = false;
    } else if (this.step === View.SELECT_PIPELINE) {
      this.selectedSessions.clear()
      this.step = this.step + 1;
      this.backBtnState = true;
    } else {
      this.step = this.step + 1;
      this.backBtnState = true;
    }
  }

  @action.bound prevStep(): void {
    if (this.step > 0) {
      this.step = this.step - 1;
    } else if (this.step <= 0) {
      this.backBtnState = false;
    }
    this.nextBtnState = true;
  }

  @action.bound cancelWizard() {
    this.appState.view = AppView.DPP_LIST;
    this.step = View.SELECT_PIPELINE;
    this.nextBtnState = true;
  }

  @action.bound resetAllSettings() {
    this.selectedTrainingPhaseIdx = 0;
    this.errorMsg = '';
    this.selectedTrainingSessionIdx = 0;
    this.trainingChannelMap = null;
    this.trainingPhaseMap = null;
    this.trainingSessionMap = null;
    this.trainingResults = null;
    this.numsOutlinerScore = [1, 1];
    this.sessionNChunkScore = 1;
    this.phaseNum = 1;
    this.percentileVals.replace([5, 95]);
    this.channelScoreAggMethod = 'mean';
    this.phaseScoreAggMethod = 'mean';
    this.chunkScoreAggMethod = 'mean';
    this.selectedSessions.replace([]);
    this.nextBtnState = true;
    this.backBtnState = false;
    this.nOfCentroids = 23;
    this.nOfFeatures = 56;
    this.sessionPercentage = 58;
    this.selectedPhaseIndex = 0;
    this.availableKeys.replace([]);
    this.phases.replace([]);
  }

  // filters
  @action onStartDateChange(startDate: number): void {
    this.filterStartDate = startDate;
  }

  @action onStopDateChange(endDate: number): void {
    this.filterEndDate = endDate;
  }

  @action undescoreStateChange(state: boolean): void {
    this.filterUnderScore = state;
  }

  @action.bound onQualityScoreChange(value: number): void {
    this.filterScore = value;
  }

  @action setFeedbackFilter(num: FeedbackEnum): void {
    this.filterFeedback = num;
  }

  @action.bound setIsLastStep(state: boolean): void {
    this.isLastStep = state;
    if (state === false) {
      this.step = 0;
    }
  }

  @action.bound resetFilter(): void {
    this.filterEndDate = null;
    this.filterStartDate = null;
    this.filterScore = null;
    this.filterFeedback = FeedbackEnum.UNSET;
    this.filterUnderScore = false;
    this.handleFilterPipeline();
  }

  @action.bound setPercentileVals(values: number[]): void {
    this.percentileVals.replace(values);
  }

  @action.bound setNumsOutlinerScore(val: number, index: number): void {
    this.numsOutlinerScore[index] = val;
  }

  @stepBackOnError @displayApiError
  async selectAssetApi() {
    // type, variant, pipeline
    return apiRequest(APIS.SELECT_ASSET, {
      asset_type: this.assetTypeStore.selectedAssetType.name,
      asset_variant: this.assetTypeStore.selectedVariant._id,
      asset_pipeline: this.assetTypeStore.selectedChannel.name,
    })
    .then((apiResult: any) => {
      console.log('selectAssetApi', apiResult);
      return apiResult;
    });
  }

  @action.bound
  async handleFilterPipeline() {
    const assetFilter =
      this.assetTypeStore.selectedAssetType ? {
        asset_instance: this.assetTypeStore.instanceName || null, // ASSET ID
        asset_type: this.assetTypeStore.selectedAssetType.name, // ASSET TYPE
        asset_variant: this.assetTypeStore.selectedVariant?._id || null,
        asset_channel: this.assetTypeStore.selectedChannel?.name || null,
      } : null;
    // calling data
    let tempFeedback: FeedbackEnum | null = null;
    if (this.filterFeedback !== FeedbackEnum.UNSET) {
      tempFeedback = this.filterFeedback;
    }
    const res = await this.dppSessionStore.filteredSessions(
      this.filterStartDate, this.filterEndDate,
      assetFilter, this.filterScore, this.filterUnderScore, tempFeedback, null, null, null);
    if (res) {
      const sessions: IResultsData[] = res[0];
      this.dppSessionStore.updateDisplayedSessions(sessions, res[1]);
    }
  }

  @action.bound setTrainingSettings(name: string, val: number): void {
    if (name === 'sessionPercentage') {
      this.sessionPercentage = val;
    } else if (name === 'nOfFeatures') {
      this.nOfFeatures = val;
    } else if (name === 'nOfCentroids') {
      this.nOfCentroids = val;
    }
  }

  @action.bound receivePlcKeys(plcTags: { [plcTagName: string]: string[] | number[] | string | number }) {
    this.plcTags = plcTags;
    const availableKeys: PLCKey[] = [];
    _.forOwn(plcTags, (value: string | number, tag: string) => {
      if (!RESERVED_ANNOTATION_KEYS.has(tag)) {
        const type = typeof value === 'string' ? 'string' : 'number';
        availableKeys.push({type, tag, example: value});
      }
    });
    this.availableKeys.replace(availableKeys);
  }

  @action disableNextBtn(): void {
    this.nextBtnState = false;
  }

  @action disableBackBtn(): void {
    this.backBtnState = false;
  }

  @action enableNextBtn(): void {
    this.nextBtnState = true;
  }

  @action.bound toggleApiErrorDialog(): void {
    this.apiErrorDialog = !this.apiErrorDialog;
    if (this.apiErrorDialog === false) {
      this.errorMsg = '';
    }
  }

  @action setSelectedSessions(indexes: number[]): void {
    this.selectedSessions.replace(indexes);
  }

  @action selectPhase(index: number) {
    this.selectedPhaseIndex = index;
  }

  @action.bound setChunkScoreAggMethod(val: string): void {
    this.chunkScoreAggMethod = val;
    // this.setAggregationMethodsApi().then(this.recieveTrainingResults);
  }

  @action.bound setPhaseScoreAggMethod(val: string): void {
    this.phaseScoreAggMethod = val;
    this.setAggregationMethodsApi().then(this.recieveTrainingResults);
  }

  @action.bound setChannelScoreAggMethod(val: string): void {
    this.channelScoreAggMethod = val;
    this.setAggregationMethodsApi().then(this.recieveTrainingResults);
  }

  @stepBackOnError @displayApiError setPhaseDefinitionApi(): Promise<void> {
    const phases = this.phases;
    return apiRequest(APIS.SET_PHASE_DEFINITIONS, {phase_tags: phases});
  }

  @stepBackOnError @displayApiError setSelectedSessionIdsApi(): Promise<void> {
    const sessionIds = this.selectedSessionIds;
    return apiRequest(APIS.SELECT_SESSIONS, {session_ids: sessionIds});
  }

  // train_percent: int, n_features: int, n_centroids: int
  @action.bound @stepBackOnError @displayApiError setTrainingSettingsApi(): Promise<TrainingResults> {
    return apiRequest(APIS.TRAIN_MODELS, {
      train_percent: this.sessionPercentage / 100,
      // eslint-disable-next-line
      n_features: this.nOfFeatures,
      n_centroids: this.nOfCentroids,
    });
  }

  // chunk, phase, channel
  @displayApiError setAggregationMethodsApi(): Promise<TrainingResults> {
    return apiRequest(APIS.SET_AGGREGATION_METHODS, {
      chunk: this.chunkScoreAggMethod,
      phase: this.phaseScoreAggMethod,
      channel: this.channelScoreAggMethod,
    });
  }

  @action.bound recieveTrainingResults(trainingResults: TrainingResults) {
    if (trainingResults && trainingResults.chunk_score_aggregate) {
      this.trainingResults = trainingResults;
      this.trainingSessionMap = Object.keys(trainingResults.chunk_score_aggregate);
      this.trainingPhaseMap = Object.keys(trainingResults.chunk_score_aggregate[this.trainingSessionMap[0]]);
      this.trainingChannelMap = Object.keys(
        trainingResults.chunk_score_aggregate[this.trainingSessionMap[0]][this.trainingPhaseMap[0]]);
    } else {
      this.trainingResults = null;
      this.trainingSessionMap = null;
      this.trainingPhaseMap = null;
      this.trainingChannelMap = null;
    }
    return trainingResults;
  }

  saveDppBuild(): Promise<void> {
    return apiRequest(APIS.SAVE_DPP_BUILD)
    .then((apiResult: any) => {
      if (apiResult.error) {
        console.log(apiResult.error);
      } else {
        this.isDppSaved = true;
      }
      this.step = this.step + 1;
      return apiResult;
    });
  }

  @computed get selectedSessionIds(): any {
    const ids: number[] = this.selectedSessions.map((num) => this.dppSessionStore.displayedSessions[num]._id);
    return ids ? ids : [];
  }

  @action.bound fetchPlcKeys() {
    return apiRequest(APIS.PLC_TAGS)
    .then((apiResult) => {
      console.log('apiResult', apiResult)
      if (apiResult && !apiResult.error) {
        this.receivePlcKeys(apiResult);
      } else {
        console.log('fetch plc', apiResult);
      }
    });
  }


  @action.bound addPhase() {
    this.phases.push([{...DEFAULT_PHASE_PARAMETER}]);
  }

  @action.bound removePhase() {
    this.phases.pop();
  }

  @action.bound addParameter() {
    this.selectedPhase.push({
      operator: '==',
      tag: this.availableKeys[0].tag,
      value: this.availableKeys[0].example,
    });
  }

  @action removeParameter(index: number) {
    this.selectedPhase.splice(index, 1);
  }

  @action updateParameter(index: number, update: any) {
    _.forOwn(update, (value, key) => {
      this.selectedPhase[index][key] = value;
    });
  }

  @action selectPhaseIndex(index: number) {
    this.selectedPhaseIndex = index;
  }

  @computed get selectedPhase() {
    if (!this.phases.length) {
      return [];
    }
    return this.phases[this.selectedPhaseIndex];
  }

  get selectedTrainingSessionId(): string {
    return this.trainingSessionMap[this.selectedTrainingSessionIdx];
  }

  set selectedTrainingSessionId(sessionId: string) {
    this.selectedTrainingSessionIdx = this.trainingSessionMap.findIndex(sessionId);
  }

  @computed get selectedTrainingPhaseId(): string | number {
    return this.trainingPhaseMap[this.selectedTrainingPhaseIdx];
  }

  set selectedTrainingPhaseId(phaseId: string | number) {
    this.selectedTrainingPhaseIdx = this.trainingPhaseMap.indexOf(phaseId as never);
  }

  get selectedTrainingPhase(): PhaseResults {
    return this.trainingResults.outlier_scores[this.selectedTrainingSessionId][this.selectedTrainingPhaseId];
  }

  @computed get outlierResults(): DataChannel[] {
    const selectedPhase = this.selectedTrainingPhase;
    return Object.values(selectedPhase.channelScores).map((item: ChannelScores) => {
      let min = Infinity;
      let max = -Infinity;
      item.scores.forEach((dataPoint) => {
        max = Math.max(max, dataPoint.value);
        min = Math.min(min, dataPoint.value);
      });
      const getColor: any = () => '#8637ba';
      const newGuid: string = '' + Math.random();
      return {
        key: newGuid,
        bargraphMax: 10,
        bargraphMin: 0,
        bargraphYAxis: true,
        bt: selectedPhase.bt,
        chartType: 'bargraph',
        chunkSizeMcs: item.chk_size_mcs,
        data: item.scores,
        getColor,
        guid: newGuid,
        hash: newGuid,
        image: '',
        name: 'outliers',
        // renderTooltip: (bt: number) => this.showOutlierTooltip(bt, simulated),
        subtitle: `Min:${min.toFixed(2)} Max:${max.toFixed(2)}`,
        title: `${this.selectedTrainingPhaseId}: Channel ${item.channel_id}`,
        tt: selectedPhase.tt,
        type: 'data',
      };
    });
  }

  @computed get sessionQualityScores(): DataChannel {
    let min = Infinity;
    let max = -Infinity;
    let data = [];
    let chunkSizeMcs = 0;
    if (this.trainingResults) {
      chunkSizeMcs = 1;
      data = Object.values(this.trainingResults.quality_score).map((score, i) => {
        min = Math.min(min, score);
        max = Math.max(max, score);
        return {
          time: i * 1e6,
          value: score,
        };
      });
    } else {
      min = 0;
      max = 0;
    }

    const newGuid = '' + Math.random();
    const getColor: any = () => '#8637ba';
    return {
      bargraphMax: 10,
      bargraphMin: 0,
      bargraphYAxis: true,
      bt: 0,
      chartType: 'bargraph',
      chunkSizeMcs,
      data,
      getColor,
      guid: newGuid,
      hash: newGuid,
      image: '',
      name: 'aggregation',
      subtitle: `Min:${min.toFixed(2)} Max:${max.toFixed(2)}`,
      taller: true,
      title: "Quality Scores for Each Test Sessions",
      tt: data.length,
      type: 'data',
    };
  }
}
