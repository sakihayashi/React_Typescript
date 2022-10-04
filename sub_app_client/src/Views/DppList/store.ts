import { action, /* IObservableArray, */makeObservable, observable } from 'mobx';
import AppState from '../../appState';

import apiRequest, {APIS, /* AssetData, */ FeedbackEnum, IResultsData/* isErrorResponse */} from '../../api';
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

export default class DppListStore {
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

  // get currentPage(): number {
  //     return this.prevDisplayed.length + 1;
  // }
  @observable displayedSessions: IResultsData[] = [];
  @observable loading = false;
  @observable uploading = false;
  @observable filters: Filters = {};
  @observable totalFilteredSessions: number = 0;
  @observable rowsPerPage: number = 10;  // filteredSessions limit
  @observable currentSessionChartType = 'peaks';
  appState: AppState;

  private prevDisplayed: Array<{ displayedStartBt: number; displayedEndBt: number }> = [];

  constructor(appState?: AppState) {
      makeObservable(this);
      this.appState = appState;
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
      });
  }

  // sensorDataBase64(sessionId: number): Promise<string[]> {
  //     return apiRequest(APIS.GET_SESSION_SENSORS_DATA_AS_BASE64, { _id: sessionId});
  // }

  @action receiveFilteredSessions(results: any[]): void {
      if (results && results.length) {
          this.displayedSessions = results[0];
          if (results.length > 1) {
              this.totalFilteredSessions = results[1];
          }
      }
  }

  @action setFilters(startBt?: number, endBt?: number, assetsFilter?: Filters['assetsFilter'],
      qualityThreshold?: number, underScoreFilter?: boolean, feedback?: FeedbackEnum,
      retrieveSensorData?: boolean): Promise<any> {
      this.filters = observable({
          assetsFilter, endBt, feedback, qualityThreshold, retrieveSensorData, startBt, underScoreFilter,
      });
      return this.filteredSessions(
          startBt, endBt, assetsFilter, qualityThreshold,
          underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
          .then((results: any) => this.receiveFilteredSessions(results));
  }

  // updateCurrentPage() {
  //     const {
  //         assetsFilter, feedback, qualityThreshold, retrieveSensorData, underScoreFilter,
  //     } = this.filters;
  //     return this.filteredSessions(
  //         this.displayedStartBt, this.displayedEndBt, assetsFilter,
  //         qualityThreshold, underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
  //         .then((results: any) => this.receiveFilteredSessions(results.slice(0, 1)));
  // }

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
      const { displayedEndBt, displayedStartBt } = this.prevDisplayed.pop();
      return this.filteredSessions(
          displayedStartBt, displayedEndBt, assetsFilter,
          qualityThreshold, underScoreFilter, feedback, retrieveSensorData, this.rowsPerPage)
          .then((results: any) => {
              this.receiveFilteredSessions(results.slice(0, 1));
          });
  }

    // @action receiveUploadSessions(response: any[]) {
    //     this.uploading = false;
    //     if (!isErrorResponse(response)) {
    //         this.uploadNotification();
    //     }
    //     return response;
    // }

    // @action.bound @handleErrorResponse uploadSessionsById(sessionIds: number[]) {
    //     this.uploading = true;
    //     return apiRequest(APIS.UPLOAD_SESSIONS_BY_ID, { sessions_to_upload_ids: sessionIds})
    //     .then((response: any) => this.receiveUploadSessions(response));
    // }

    // storeUserFeedback(sessionIds: number | number[], feedback: IFeedback) {
    //     return apiRequest(APIS.STORE_FEEDBACK, {
    //         feedback: feedback.feedback,
    //         note: feedback.feedback_comment,
    //         source_set_id: sessionIds,
    //     });
    // }

    // @action setChartType(chartType: string): void {
    //     this.currentSessionChartType = chartType;
    // }

    // uploadNotification(): void {
    //     this.appState.toastStore.addToast({
    //         duration: 5000,
    //         severity: 'success',
    //         message: 'Session uploaded successfully',
    //     });
    // }

    // getDppBuilds(): Promise<any> {
    //     return apiRequest(APIS.LIST_DPP_BUILDS);
    // }
}
