import { forEach } from 'lodash';
import { action, computed, IObservableArray, makeObservable, observable } from 'mobx';
import apiRequest, { APIS, FeedbackEnum, IResultsData } from '../../api';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';
import { handleErrorResponse, isLoading } from '../../util';

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

export default class ReviewSessionsStore {
  get displayedStartBt(): number {  // BOTTOM oldest
    if (this.displayedSessions.length) {
      return this.displayedSessions[this.displayedSessions.length - 1].bt;
    }
  }

  get displayedEndBt(): number {  // TOP latest
    if (this.displayedSessions.length) {
      return this.displayedSessions[0].bt;
    }
  }

  get currentPage(): number {
    return this.prevDisplayed.length + 1;
  }

  @observable displayedSessions: IResultsData[] = [];
  @observable loading = false;
  @observable uploading = false;
  @observable filters: Filters = {};
  @observable totalFilteredSessions: number = 0;
  @observable rowsPerPage: number = 10;
  @observable pageNum: number = 0;
  @observable currentSessionChartType = 'peaks';
  @observable selectedSessionState: IResultsData = null;
  @observable filterStartDate: number = null;
  @observable filterEndDate: number = null;
  @observable filterScore: number = null;
  @observable filterUnderScore: boolean = false;
  @observable filterFeedback: FeedbackEnum = FeedbackEnum.ALL;
  @observable filterRdy: string = null;
  @observable selectedIds: IObservableArray<string> = observable.array([]);
  @observable fromLastSession: boolean = false;
  @observable rdyNames: IObservableArray<string> = observable.array([]);
  @observable filterBtnDisabled: boolean = false;
  @observable storedComments: IObservableArray<string> = observable.array([]);
  @observable expandedRows: IObservableArray<boolean> = observable.array([false, false, false, false, false, false, false, false, false, false]);

  appState: AppState;
  assetTypeStore: AssetTypeStore;

  private prevDisplayed: { displayedStartBt: number, displayedEndBt: number }[] = [];

  constructor(appState?: AppState, assetTypeStore?: AssetTypeStore) {
    makeObservable(this);
    this.appState = appState;
    this.assetTypeStore = assetTypeStore;
  }
  @action.bound setExpandedRows(arr: boolean[]){
    this.expandedRows.replace(arr);
  }
  @action.bound initializeExpandedRows(num: number){
    const arr = Array.from({length: num}, i => i = false);
    this.expandedRows.replace(arr);
  }
  @action.bound setStoredComments(arr: string[]) {
    if (arr?.length) {
      this.storedComments.replace(arr);
    }
  }

  @action.bound setFilterBtnDisabled(state: boolean){
    this.filterBtnDisabled = state;
  }

  @action.bound setFilterRdy(val: string){
    this.filterRdy = val;
  }
  resetPrevDisplayed() {
    this.prevDisplayed = [];
  }
  @action.bound getRdyNames(){
    const arr = [];
    this.assetTypeStore.assetTypes.forEach(type => type.variants.forEach(variant => variant.channels.forEach(channel => {
      if (channel.definition && channel.definition.source_configs && channel.definition.source_configs.length){
        channel.definition.source_configs.forEach(configObj => {
          if (configObj.plc_cfg && configObj.plc_cfg.read_tags.length){
            configObj.plc_cfg.read_tags.forEach(tag => {
              if (tag.is_readiness && !!tag.name){
                arr.push(tag.name);
              }
            });
          }
        });
      }
    })));
    const unique = new Set(arr);
    this.rdyNames.replace(Array.from(unique));
  }
  @action.bound setRowsPerPage(num: number){
    this.rowsPerPage = num;
  }
  @action.bound setPageNum(page: number){
    this.pageNum = page;
  }

  @handleErrorResponse @isLoading filteredSessions(
    startBt?: number,
    endBt?: number,
    assetsFilter?: any,
    qualityThreshold?: number,
    underScoreFilter?: boolean,
    feedback?: FeedbackEnum,
    retrieveSensorData?: boolean,
    limit?: number,
    sessionId?: number | number[],
    rdy_value?: string,
  ): Promise<[IResultsData[], number]> {

    let tempFeedback = feedback || null;
    if (feedback === FeedbackEnum.ALL) {
      tempFeedback = null;
    }
    return apiRequest(APIS.FILTERED_SESSIONS, {
      assets_filter: assetsFilter,
      end_bt: endBt,
      feedback: tempFeedback,
      limit,
      quality_threshold: qualityThreshold,
      source_set_ids: sessionId,
      start_bt: startBt,
      under_quality_threshold_score: underScoreFilter === true,
      rdy_value,
    });
  }

  filterSessionById(sessionId: number): Promise<[IResultsData[], number]> {
    const tempId = sessionId + '';
    return apiRequest(APIS.FILTERED_SESSIONS, {
      limit: 1,
      source_set_ids: [tempId],
    });
  }

  @handleErrorResponse @isLoading sensorDataBase64(sessionId: number): Promise<string[]> {
    return apiRequest(APIS.GET_SESSION_SENSORS_DATA_AS_BASE64, {_id: sessionId});
  }

  @action.bound setSelectedSessionState(data: IResultsData | null): void {
    this.selectedSessionState = data;
  }
  @computed get selectedSessionChannelNames(): string[] {
    return this.selectedSessionState?.channel_definition?.source_configs?.
      find(cfg => cfg.buffer_name !== 'events_buffer_reader').device_channels?.
      filter(ch => ch.channel_selected === true).
      map(({channel_name, channel_id}) => (channel_name) ? `${channel_id}-${channel_name}` : channel_id);
  }

  @action receiveFilteredSessions(results: [IResultsData[], number]): [IResultsData[], number] {
    if (results && results.length) {
      this.displayedSessions = results[0];
      if (results.length > 1) {
        this.totalFilteredSessions = results[1];
      }
    }
    return results;
  }

  @action.bound setFilterValues(fieldName: string, value: number | boolean | FeedbackEnum) {
    this.filters[fieldName as string] = value;
  }

  @action.bound replaceSelectedIds(ids: string[]) {
    this.selectedIds.replace(ids);
  }

  @action setFilters(startBt?: number, endBt?: number, assetsFilter?: Filters['assetsFilter'],
                     qualityThreshold?: number, underScoreFilter?: boolean,
                     feedback?: FeedbackEnum,
                     retrieveSensorData?: boolean): Promise<[IResultsData[], number]> {
    this.filters = observable({
      assetsFilter, endBt, feedback, qualityThreshold, retrieveSensorData, startBt, underScoreFilter,
    });
    return this.filteredSessions(
      startBt, endBt, assetsFilter, qualityThreshold,
      underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage, null, this.filterRdy)
      .then((results: any) => this.receiveFilteredSessions(results));
  }

  @action.bound formatAndCallSetFilters(): Promise<[IResultsData[], number]> {
    const {selectedAssetType, selectedVariant} = this.assetTypeStore;
    let tempFeedbackVal = this.filterFeedback;
    if (this.filterFeedback === FeedbackEnum.ALL) {
      tempFeedbackVal = null;
    }
    const assetFilter = {
      asset_type: selectedAssetType ? selectedAssetType.name : null,
      asset_variant: selectedVariant ? selectedVariant._id : null,
      asset_instance: null,
    };
    return this.setFilters(
      this.filterStartDate, this.filterEndDate, assetFilter,
      this.filterScore, this.filterUnderScore, tempFeedbackVal,
    );
  }

  @action.bound resetFilters() {
    this.assetTypeStore.selectedAssetType = null;
    this.assetTypeStore.selectedVariant = null;
    this.assetTypeStore.assetTypeName = '';
    this.assetTypeStore.assetVariantName = '';
    this.filterEndDate = null;
    this.filterStartDate = null;
    this.filterScore = null;
    this.filterFeedback = FeedbackEnum.ALL;
    this.filterUnderScore = false;
    this.filterRdy = null;
    this.setPageNum(0);
    this.resetPrevDisplayed();
    return this.formatAndCallSetFilters();
  }

  @action.bound setFilterScore(score: number) {
    this.filterScore = score;
  }

  @action.bound setFilterEndDate(endDate: number) {
    this.filterEndDate = endDate;
  }

  @action.bound setFilterStartDate(startDate: number) {
    this.filterStartDate = startDate;
  }

  @action.bound setFilterUnderScore(state: boolean) {
    this.filterUnderScore = state;
  }

  @action.bound setFeedbackFilter(num: FeedbackEnum | null): void {
    this.filterFeedback = num;
  }

  @action.bound updateCurrentPage() {
    const {
      assetsFilter, feedback, qualityThreshold, retrieveSensorData, underScoreFilter,
    } = this.filters;
    let tempFeedback: FeedbackEnum | null = feedback;
    if (feedback === FeedbackEnum.ALL) {
      tempFeedback = null;
    }
    return this.filteredSessions(
      this.displayedStartBt, this.displayedEndBt, assetsFilter,
      qualityThreshold, underScoreFilter, tempFeedback, retrieveSensorData, this.rowsPerPage)
      .then((results: any) => this.receiveFilteredSessions(results.slice(0, 1)));
  }

  @action.bound nextPage() {
    const {
      assetsFilter, feedback, qualityThreshold, retrieveSensorData, underScoreFilter,
    } = this.filters;
    // if coming from last session startBt is the last session's
    if (this.fromLastSession){
      this.prevDisplayed.pop();
    } else {
      this.prevDisplayed.push({
        displayedStartBt: this.displayedStartBt,
        displayedEndBt: this.displayedEndBt,
      });
    }
    return this.filteredSessions(
      this.filterStartDate, this.displayedStartBt - 1, assetsFilter,
      qualityThreshold, underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
      .then((results: any) => {
        this.receiveFilteredSessions(results.slice(0, 1));
      });
  }

  @action.bound lastPage() {
    const {
      assetsFilter, feedback, qualityThreshold, retrieveSensorData, underScoreFilter,
    } = this.filters;
    this.fromLastSession = true;
    const totalPageNum = Math.ceil(this.totalFilteredSessions / this.rowsPerPage);
    for (let i = 0; i < totalPageNum; i++){
      this.filteredSessions(
        null, this.displayedStartBt - 1, assetsFilter,
        qualityThreshold, underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
        .then((results: any) => {
          const sessions = results.slice(0, 1);
          const len = results[0].length;
          this.prevDisplayed.push({
            displayedEndBt: results[0][0].bt,
            displayedStartBt: results[0][len - 1].bt,
          });
          if (i === totalPageNum -1){
            this.receiveFilteredSessions(sessions);
          }
        });
    }
  }

  prevPage() {
    const {
      assetsFilter, feedback, qualityThreshold, retrieveSensorData, underScoreFilter,
    } = this.filters;
    const { displayedStartBt,  displayedEndBt } = this.prevDisplayed.pop();

    return this.filteredSessions(
      displayedStartBt, displayedEndBt, assetsFilter,
      qualityThreshold, underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
      .then((results: any) => {
        const sessions = results.slice(0, 1);
        this.receiveFilteredSessions(sessions.slice(-10));
      });
  }
  @action.bound firstPage() {
    const {
      assetsFilter, feedback, qualityThreshold, retrieveSensorData, underScoreFilter,
    } = this.filters;
    this.fromLastSession = false;
    this.prevDisplayed = [];
    return this.filteredSessions(
      null, null, assetsFilter,
      qualityThreshold, underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
      .then((results: any) => {
        this.receiveFilteredSessions(results.slice(0, 1));
      });
  }

  @action setChartType(chartType: string): void {
    this.currentSessionChartType = chartType;
  }
}
