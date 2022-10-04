import {action, computed, IObservableArray, makeObservable, observable} from 'mobx';
import apiRequest, {
  APIS,
  FeedbackEnum,
  IResultsData,
} from '../../api';
import AppState from '../../appState';
import {handleErrorResponse, isLoading} from '../../util';

interface Filters {
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

interface PhaseResults {
  bt: number;
  tt: number;
  channelScores: Array<{
    channel_id: string;
    chk_size_mcs: number;
    scores: Array<{ time: number; value: number }>;
  }>;
}

interface SessionResults {
  bt: number;
  tt: number;
  results: Array<{ bt: number; score: number; tt: number }>;
}

const mkScoreArray = (duration: number, chkSize: number) => {
  const results = [];
  let currentTime = 0;
  while (currentTime < duration) {
    const newTime = currentTime + chkSize;
    results.push({value: Math.random() * 50, time: currentTime});
    currentTime = newTime;
  }
  return results;
};

const mkSessionScoreArray = (duration: number, chkSize: number) => {
  const results = [];
  let currentTime = 0;
  while (currentTime < duration) {
    const newTime = currentTime + chkSize;
    results.push({bt: currentTime, score: Math.random() * 50, tt: newTime});
    currentTime = newTime;
  }
  return results;
};

const DFLT_CHK_SIZE_MCS: number = 10000

const makeMockPhaseResults = () => [{
  bt: 0,
  channelScores: [{
    channel_id: "p1c1",
    chk_size_mcs: DFLT_CHK_SIZE_MCS,
    scores: mkScoreArray(20000000, DFLT_CHK_SIZE_MCS / 10),
  }, {
    channel_id: "p1c2",
    chk_size_mcs: DFLT_CHK_SIZE_MCS,
    scores: mkScoreArray(20000000, DFLT_CHK_SIZE_MCS / 10),
  }],
  tt: 20000000,
}, {
  bt: 0,
  channelScores: [{
    channel_id: "p2c1",
    chk_size_mcs: DFLT_CHK_SIZE_MCS,
    scores: mkScoreArray(40000000, DFLT_CHK_SIZE_MCS / 10),
  }, {
    channel_id: "p2c2",
    chk_size_mcs: DFLT_CHK_SIZE_MCS,
    scores: mkScoreArray(40000000, DFLT_CHK_SIZE_MCS / 10),
  }],
  tt: 40000000,
}];
const makeMockSessionResults = () => [{
  bt: 0,
  results: mkSessionScoreArray(40000000, DFLT_CHK_SIZE_MCS / 10),
  tt: 40000000,
}, {
  bt: 0,
  results: mkSessionScoreArray(60000000, DFLT_CHK_SIZE_MCS / 10),
  tt: 60000000,
}];

export default class DppSessionsStore {
  get displayedStartBt(): number {  // BOTTOM
    if (this.displayedSessions.length) {
      return this.displayedSessions[this.displayedSessions.length - 1].bt;
    }
  }

  get displayedEndBt(): number {  // TOP
    if (this.displayedSessions.length) {
      return this.displayedSessions[0].bt;
    }
  }

  @computed get selectedPhaseBt() {
    if (!this.selectedPhase) {
      return 0;
    }
    return this.selectedPhase.bt;
  }

  @computed get selectedPhaseTt() {
    if (!this.selectedPhase) {
      return 0;
    }
    return this.selectedPhase.tt;
  }

  @computed get selectedPhase() {
    if (!this.phaseResults || this.selectedPhaseIndex < 0) {
      return null;
    }
    return this.phaseResults[this.selectedPhaseIndex];
  }

  @computed get selectedSession() {
    if (this.selectedSessionIndex < 0) {
      return null;
    }
    return this.sessionResults[this.selectedSessionIndex];
  }

  @computed get sessionBt() {
    if (!this.selectedSession) {
      return 0;
    }
    return this.selectedSession.bt;
  }

  @computed get sessionTt() {
    if (!this.selectedSession) {
      return 0;
    }
    return this.selectedSession.tt;
  }

  @computed get aggregationResults() {
    if (!this.selectedSession || !this.selectedSession.results) {
      return [];
    }
    return this.selectedSession.results;
  }

  @observable displayedSessions: IObservableArray<IResultsData> = observable.array([]);
  @observable loading = false;
  @observable uploading = false;
  @observable filters: Filters = {};
  @observable totalFilteredSessions: number = 0;
  @observable rowsPerPage: number = 10;  // filteredSessions limit
  @observable currentSessionChartType = 'peaks';
  @observable selectedPhaseIndex = 0;
  @observable selectedSessionIndex = 0;
  @observable phaseResults: IObservableArray<PhaseResults> = observable.array(makeMockPhaseResults());
  @observable sessionResults: IObservableArray<SessionResults> = observable.array(makeMockSessionResults());
  appState: AppState;

  private prevDisplayed: Array<{ displayedStartBt: number; displayedEndBt: number }> = [];

  constructor(appState?: AppState) {
    makeObservable(this);
    this.appState = appState;
  }

  @handleErrorResponse @isLoading filteredSessions(
    startBt?: number, endBt?: number,
    assetsFilter?: any, qualityThreshold?: number,
    underScoreFilter?: boolean,
    feedback?: FeedbackEnum,
    retrieveSensorData?: boolean, limit?: number,
    sessionId?: number | number[]): Promise<[IResultsData[], number]> {
    return apiRequest(
      APIS.FILTERED_SESSIONS,
      {
        assets_filter: assetsFilter,
        end_bt: endBt,
        feedback,
        limit,
        quality_threshold: qualityThreshold,
        source_set_ids: sessionId,
        start_bt: startBt,
        under_quality_threshold_score: underScoreFilter === true,
      },
    );
  }

  @action receiveFilteredSessions(results: any[]): void {
    if (results && results.length) {
      this.displayedSessions.replace(results[0]);
      console.log('filtered? from store', this.displayedSessions);
      if (results.length > 1) {
        this.totalFilteredSessions = results[1];
      }
    }
  }

  @action setFilters(startBt?: number, endBt?: number, assetsFilter?: Filters['assetsFilter'],
                     qualityThreshold?: number, underScoreFilter?: boolean, feedback?: FeedbackEnum,
                     retrieveSensorData?: boolean): Promise<any> {
    this.filters = observable({
      assetsFilter,
      endBt,
      feedback,
      qualityThreshold,
      retrieveSensorData,
      startBt,
      underScoreFilter,
    });
    return this.filteredSessions(
      startBt, endBt, assetsFilter, qualityThreshold,
      underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
    .then((results: any) => this.receiveFilteredSessions(results));
  }

  @action updateDisplayedSessions(sessions: IResultsData[], num: number) {
    this.displayedSessions.replace(sessions);
    this.totalFilteredSessions = num;
  }

  nextPage() {
    const {
      assetsFilter, feedback, qualityThreshold, retrieveSensorData, startBt, underScoreFilter,
    } = this.filters;
    this.prevDisplayed.push({
      displayedEndBt: this.displayedEndBt,
      displayedStartBt: this.displayedStartBt,
    });
    return this.filteredSessions(
      startBt, this.displayedStartBt - 1, assetsFilter,
      qualityThreshold, underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
    .then((results: any) => {
      this.receiveFilteredSessions(results.slice(0, 1));
    });
  }

  prevPage() {
    const {
      assetsFilter, feedback, qualityThreshold, retrieveSensorData, underScoreFilter,
    } = this.filters;
    const {displayedEndBt, displayedStartBt} = this.prevDisplayed.pop();
    return this.filteredSessions(
      displayedStartBt, displayedEndBt, assetsFilter,
      qualityThreshold, underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
    .then((results: any) => {
      this.receiveFilteredSessions(results.slice(0, 1));
    });
  }

  @action setChartType(chartType: string): void {
    this.currentSessionChartType = chartType;
  }
}
