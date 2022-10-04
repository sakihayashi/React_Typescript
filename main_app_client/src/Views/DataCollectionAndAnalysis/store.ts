import * as _ from 'lodash';
import {action, computed, IObservableArray, makeObservable, observable, toJS} from 'mobx';
import apiRequest, {
  APIS,
  FeedbackEnum,
  IErrorResponse,
  IResourceData,
  IResultsData,
  isErrorResponse,
  SystemStepIcon,
  TestingViews,
  TestStatus,
} from '../../api';
import AppState from '../../appState';
import {isLoading} from '../../util';
import {isSnakeCase, replaceAll} from '../../Utility';
import AbstractScreenManager, {IScreenManager} from '../../Utility/AbstractScreenManager';
import {ReviewSessionsStore} from '../../Views/ReviewSessions';

const TECHNICIAN_SCREEN_ORDER: TestingViews[] = [
  TestingViews.ASSET_SELECTION,
  TestingViews.RECORD_AND_TEST,
];

export interface TabIndex {
  index: number;
  id: number;
}

export default class DataCollectionStore extends AbstractScreenManager implements IScreenManager {
  @observable reviewSessionsStore: ReviewSessionsStore;
  @observable recordingSession: number = null;
  @observable recordingStart: number = null;
  @observable recordingStop: number = null;
  @observable recordingResults: any = null;
  @observable resourceData: IResourceData = null;
  @observable resourceFiles = {};
  @observable isServerReady: boolean = false;
  @observable isShowingDiscardDialog: boolean = false;
  @observable testStatus: TestStatus = {
    asset_data: null,
    bt: 0,
    detected_anomalies_count: 0,
    is_learning: null,
    is_running: null,
    last_session: null,
    pipeline_name: null,
    threshold: 5,
    start_count: null,
    is_starting: false,
    is_recording: false,
    qs_session_num: 0,
    quality_score: null,
    system_msgs: null,
    system_progress: null,
  };
  @observable isStopped: boolean = false;
  @observable firstSession: IResultsData = null;
  @observable lastSession: IResultsData = null;
  @observable last20Sessions: IObservableArray<IResultsData> = observable.array([]);
  @observable latestSessionNum: number | string = this.appState.locale.getString('global.na');
  @observable lastCount: number | string = this.appState.locale.getString('global.na');
  @observable isRecordingDone: boolean = false;
  @observable wizardStep: number = 0;
  @observable activeTab: number = 0;
  @observable tabHeads: IObservableArray<string> = observable.array([]);
  @observable openedTabs: IObservableArray<IResultsData> = observable.array([]);
  @observable addFeedback: boolean = false;
  @observable systemMsg: string = '';
  @observable isDpp: boolean = false;
  @observable openedTabIndex: IObservableArray<TabIndex> = observable.array([]);
  @observable stepTitles: IObservableArray<string> = observable.array([]);
  @observable latesessionId: number = null;
  @observable isPlc: boolean = false;
  @observable testManuallyStopped: boolean = false;
  @observable currentStep: IObservableArray<(SystemStepIcon | string)[]> = observable.array([['testing.recordingMessage.dataAcquisition', SystemStepIcon.empty], ['testing.recordingMessage.dataAnalysis', SystemStepIcon.empty]]);
  @observable plcView: number = 0;
  @observable testStatusIntervalId: NodeJS.Timer = null;
  @observable intervalBeCanceled: boolean = false;
  @observable isBackendFailed: boolean = false;
  @observable currentSessionN: number | string = 1;
  @observable currentRdy: string | number = null;
  @observable isRdy: boolean = false;

  constructor(appState?: AppState, reviewSessionsStore?: ReviewSessionsStore) {
    super(appState, TECHNICIAN_SCREEN_ORDER);
    makeObservable(this);
    this.reviewSessionsStore = reviewSessionsStore;
    window['dataCollection'] = this;
  }

  @action.bound setIsRdy(state: boolean){
    this.isRdy = state;
  }

  @action.bound setCurrentSessionN(num: number){
    this.currentSessionN = num;
  }
  @action.bound setCurrentRdy(val: number | string){
    this.currentRdy = val;
  }

  @action.bound exitRecording: () => Promise<any> = () => {
    return Promise.resolve(this.nextScreen())
      .then(this.resetRecordingData)
      .then(this.reviewSessionsStore.resetFilters);
  };

  @action.bound setTestStatusIntervalId(id: NodeJS.Timer) {
    this.testStatusIntervalId = id;
  }

  @action.bound setIntervalBeCanceled(state: boolean) {
    this.intervalBeCanceled = state;
  }

  @action.bound setPlcView(num: number) {
    this.plcView = num;
  }

  @action.bound setCurrentStep(progress) {
    if (!!progress.length && progress !== this.currentStep && !this.testManuallyStopped) {
      // temporary showing analyzed checked icon
      const textChecked = ['sysStep.acquired', 'sysStep.analyzed'];
      if (progress[1][1] === SystemStepIcon.empty && !!this.currentStep.length && this.currentStep[1][1] === SystemStepIcon.filled) {
        const copy = [...this.currentStep];
        copy[1][1] = SystemStepIcon.checked;
        copy[1][0] = textChecked[1];
        this.currentStep.replace(copy);
      } else {
        this.currentStep.replace(progress);
      }
    } else if (!!progress.length && this.testManuallyStopped) {
      const copy = [...this.currentStep];
      if (copy[0][1] === SystemStepIcon.filled) {
        copy[0][1] = SystemStepIcon.warning;
        copy[0][0] = 'sysStep.acquisitionStopped';
        this.currentStep.replace(copy);
      } else if (copy[1][1] === SystemStepIcon.filled) {
        copy[1][1] = SystemStepIcon.warning;
        copy[1][0] = 'sysStep.analysisStopped';
        this.currentStep.replace(copy);
      }
    }
  }

  @action.bound setTestManuallyStopped(state: boolean) {
    this.testManuallyStopped = state;
  }

  @action.bound setIsPlc(state: boolean) {
    this.isPlc = state;
  }

  @action.bound setStepTitles(titles: string[]) {
    this.stepTitles.replace(titles);
  }

  @action.bound resetFilters() {
    const {selectedAssetType} = this.reviewSessionsStore.assetTypeStore;
    this.reviewSessionsStore.assetTypeStore.selectedAssetType = null;
    this.reviewSessionsStore.assetTypeStore.selectedVariant = null;
    this.reviewSessionsStore.assetTypeStore.assetTypeName = '';
    this.reviewSessionsStore.assetTypeStore.assetVariantName = '';
    this.reviewSessionsStore.filterEndDate = null;
    this.reviewSessionsStore.filterStartDate = null;
    this.reviewSessionsStore.filterScore = null;
    this.reviewSessionsStore.filterFeedback = FeedbackEnum.ALL;
    this.reviewSessionsStore.filterUnderScore = false;
    this.reviewSessionsStore.filterRdy = null;
    this.reviewSessionsStore.displayedSessions = [];
    this.reviewSessionsStore.totalFilteredSessions = 0;
    this.reviewSessionsStore.setPageNum(0);
    this.reviewSessionsStore.resetPrevDisplayed();
    // keep asset type filter after reset
    this.reviewSessionsStore.assetTypeStore.setSelectedAssetType(selectedAssetType);
    return this.filterSessionHistory();
  }

  @action.bound incrementWizardStep() {
    this.wizardStep = this.wizardStep + 1;
  }

  @action.bound setWizardStep(step: number) {
    this.wizardStep = step;
  }

  @action.bound setTabIndex(obj: TabIndex) {
    if (!this.openedTabIndex.find(tabindex => tabindex.id === obj.id)) {
      const temp = [...this.openedTabIndex];
      temp.push(obj);
      this.openedTabIndex.replace(temp);
    }
  }

  @action.bound
  async updateSessionHistory() {
    this.reviewSessionsStore.updateCurrentPage();
    if (this.openedTabs[0]) {
      const updatedData = this.openedTabs.map(async tab => {
        const res = await this.reviewSessionsStore.filterSessionById(tab._id);
        return res[0][0];
      });
      Promise.all(updatedData).then(arr => {
        this.openedTabs.replace(arr);
      });
    }
  }

  @action.bound
  async filterSessionHistory() {
    const {firstSession, lastSession} = this;
    if (!firstSession) {
      return;
    }
    // set current recording bt and tt
    let lastTt: number;
    let firstTt: number;
    const {filterEndDate, filterStartDate} = this.reviewSessionsStore;
    if (firstSession.bt === lastSession.bt) {
      lastTt = firstSession.bt + 600;
    } else {
      // assign filter date if filter end date is before last session
      if (filterEndDate && +filterEndDate < lastSession.bt) {
        lastTt = +filterEndDate;
      } else {
        lastTt = lastSession.bt;
      }
    }
    this.reviewSessionsStore.setFilterEndDate(lastTt);
    // assign filter date if filter start date is after than first session
    if (filterStartDate && +filterStartDate > firstSession.bt) {
      firstTt = +filterStartDate;
    } else {
      firstTt = firstSession.bt;
    }
    this.reviewSessionsStore.setFilterStartDate(firstTt);
    return this.reviewSessionsStore.formatAndCallSetFilters().then(() => {
      this.reviewSessionsStore.setPageNum(0);
      this.reviewSessionsStore.resetPrevDisplayed();
    });
  }

  @action.bound resetRecordingData() {
    this.isDpp = false;
    this.testStatus = {
      asset_data: null,
      bt: 0,
      detected_anomalies_count: 0,
      is_learning: null,
      is_running: null,
      last_session: null,
      pipeline_name: null,
      threshold: 5,
      start_count: null,
      is_starting: false,
      is_recording: false,
      qs_session_num: 0,
      quality_score: null,
      system_msgs: null,
      system_progress: null,
    };
    this.setTestManuallyStopped(false);
    this.currentStep.replace([['testing.recordingMessage.dataAcquisition', SystemStepIcon.empty], ['testing.recordingMessage.dataAnalysis', SystemStepIcon.empty]]);
    this.firstSession = null;
    this.lastSession = null;
    this.last20Sessions.replace([]);
    this.latestSessionNum = this.appState.locale.getString('global.na');
    this.activeTab = 0;
    this.setIsRecordingDone(false);
    this.setIsDpp(false);
    this.wizardStep = 0;
    this.stepTitles.replace([]);
    this.isPlc = false;
    this.openedTabs.replace([]);
    this.openedTabIndex.replace([]);
    this.systemMsg = '';
    this.stepTitles.replace([]);
    this.latesessionId = null;
    this.tabHeads.replace(['testing.last20Sessions']);
    this.currentSessionN = 1;
    this.currentRdy = null;
    this.isRdy = false;
  }

  @action.bound setIsDpp(state: boolean) {
    this.isDpp = state;
  }

  @action.bound setSystemMsg(str: string) {
    this.systemMsg = str;
  }

  @action.bound setScreenPlcRecording() {
    this.screen = TestingViews.RECORD_AND_TEST;
  }

  @action.bound setActiveTab(num: number) {
    this.activeTab = num;
  }

  @action.bound toggleAddFeedback() {
    this.addFeedback = !this.addFeedback;
  }

  @action.bound setTabHeads(newHead: string) {
    if (!this.tabHeads.includes(newHead)) {
      const temp = [...this.tabHeads];
      temp.push(newHead);
      this.tabHeads.replace(temp);
      this.setActiveTab(this.tabHeads.length - 1);
    } else {
      const tabIndex = this.tabHeads.indexOf(newHead);
      this.setActiveTab(tabIndex);
    }
  }

  @action.bound replaceTabHeads(arr: string[]) {
    this.tabHeads.replace(arr);
  }

  @action.bound setActiveTabCondition(index: number) {
    const len = this.openedTabs.length - 1;
    if (index >= len) {
      this.setActiveTab(index - 1);
    } else {
      this.setActiveTab(index);
    }
  }

  @action.bound removeTab(index: number) {
    this.setActiveTabCondition(index);
    const temp = [...this.openedTabs];
    const tempHeads = [...this.tabHeads];
    temp.splice(index - 1, 1);
    this.openedTabs.replace(temp);
    tempHeads.splice(index, 1);
    this.tabHeads.replace(tempHeads);
  }

  @action.bound setOpenedTabs(data: IResultsData) {
    const temp = toJS(this.openedTabs);
    temp.push(data);
    this.openedTabs.replace(temp);
  }

  @action.bound replaceOpenedTabs(val: string | FeedbackEnum, fieldName: string) {
    const temp = toJS(this.openedTabs);
    temp[this.activeTab - 1][fieldName] = val;
    this.openedTabs.replace(temp);
  }

  @action.bound receiveReset(): void {
    this.isShowingDiscardDialog = false;
    this.resourceData = null;
    this.recordingStart = null;
    this.recordingStop = null;
  }

  @action setIsStopped(state: boolean) {
    this.isStopped = state;
  }

  getSessionData(id: number): Promise<[IResultsData[], number]> {
    return this.reviewSessionsStore.filterSessionById(id);
  }

  @action.bound setLatestSessionN(num: number | string) {
    this.latestSessionNum = num;
  }

  @action.bound setLastCount(num: number | string) {
    this.lastCount = num;
  }

  @action.bound setIsRecordingDone(state: boolean) {
    this.isRecordingDone = state;
  }

  @action resetRecordingResults(): void {
    this.recordingResults = null;
  }

  resetInheritingClass(): Promise<void> {
    return this.appState.getConfig()
      .then(() => this.receiveReset());
  }

  @computed get testStatusSleepMilliseconds() {
    if (this.testStatus) {
      if (this.testStatus.is_running) {
        return 500;  // longer breaks while tests are running
      } else if (!this.testStatus.is_running) {
        return 1000;  // more frequent when waiting for user input
      }
    }
    return 5000;  // default when test status is not updating due to an error
  }

  addErrorToast(text: string) {
    this.appState.toastStore.addToast({
      duration: 5000,
      severity: 'error',
      message: text,
    });
  }

  @action.bound receiveIResultsData(results: [IResultsData[], number]) {
    if (results?.length === 2) {
      const sessionData = results[0][0];
      this.lastSession = sessionData;
      if (!this.firstSession) {
        this.firstSession = sessionData;
      }
      this.addToLast20Sessions(sessionData);
    }
  }
  @action.bound receiveIResultsDataAndReplace(results: [IResultsData[], number], id: number){
    const index = this.last20Sessions.findIndex((session) => session._id === id);
    this.last20Sessions[index] = results[0][0];
  }

  @action.bound addToLast20Sessions(sessionData: IResultsData) {
    this.last20Sessions.unshift(sessionData);
    if (this.last20Sessions.length > 20) {
      this.last20Sessions.pop();
    }
  }

  @computed get last10Sessions(): IResultsData[] {
    return this.last20Sessions.slice(0, 10).reverse();
  }

  @action receiveTestStatus(testStatus: TestStatus): Promise<void> {
    if (isErrorResponse(testStatus)) {
      // if any errors getting teststatus throw error msg
      if (!isErrorResponse(this.testStatus)) {
        const response = testStatus as IErrorResponse;
        let text: string;
        if (!response.success && response.error.startsWith('test_status')) {
          // Backend connection error: "test_status: TypeError: Failed to fetch". Caused by app crash.
          text = this.appState.locale.getString('global.connectionLost');
          this.addErrorToast(text);
          this.appState.logout();  // logout and wait for app backend to restart
        } else {
          text = (response.message) ? `${this.appState.locale.getString(response.error)}: ${this.appState.locale.getString(response.message)}` : this.appState.locale.getString(response.error);
          this.addErrorToast(text);
        }
        this.testStatus = testStatus;
      }
    } else {
      // if no error update testStatus
      this.testStatus = observable(testStatus);
      this.setCurrentStep(testStatus.system_progress);
      // if session num is more than one,
      // console.log('testStatus', toJS(testStatus));
      if (!!this.testStatus.last_session && this.latesessionId !== this.testStatus.last_session) {
        this.latesessionId = this.testStatus.last_session;
        this.latestSessionNum = Math.max(this.testStatus.start_count, this.testStatus.qs_session_num);
        this.getSessionData(testStatus.last_session)
          .then(this.receiveIResultsData)
          .then(() => {
            if (this.isPlc && this.wizardStep !== 3) {
              this.setWizardStep(3);
            }
          });
      }
      if (testStatus.is_running && this.screen !== TestingViews.RECORD_AND_TEST) {
        // change screen if still not on recording page
        this.recordingResults = null;
        this.appState.setIsLoading(false);
        return this.nextScreen();
      }
    }
    return Promise.resolve();
  }

  _updateTestStatus(): Promise<any> {
    return apiRequest(
      APIS.TEST_STATUS,
      {user_session_id: this.appState.userSession?.user_session_id}
    ).then((testStatus) => {
      this.receiveTestStatus(testStatus);
      if (this.isBackendFailed) {
        this.isBackendFailed = false;
      }
    })
      .catch(error => {
        console.log(error);
        this.isBackendFailed = true;
      });
  }

  @action.bound lastNextScreen(): void {
    this.reset();
  }

  @action.bound lastNextLabel(): string {
    return this.appState.locale.getString('util.exit');
  }

  @action.bound firstBackLabel(): string {
    return this.appState.locale.getString('util.exit');
  }

  @action onScreenChange(nextScreen: TestingViews): Promise<void> {
    return Promise.resolve();
    // if (this.screen === TestingViews.ASSET_SELECTION && nextScreen !== TestingViews.ASSET_SELECTION) {
    //     await this.submitInputFields();
    // }
    // if (this.screen === TestingViews.ASSET_SELECTION && nextScreen === TestingViews.RECORD_AND_TEST) {
    //     const ifc = await this.getNextInputField();
    //     this.defaultInputs = { ...ifc.inputs };
    // }

    // if (this.screen === TestingViews.RECORD_AND_TEST && nextScreen !== TestingViews.RECORD_AND_TEST) {
    //     // await this.stopAudio();
    // }
  }

  @action.bound @isLoading stopTesting(): Promise<void> {
    return apiRequest(
      APIS.STOP_TESTING,
      {
        is_blocking: true,
        user_session_id: this.appState.userSession?.user_session_id
      }
    ).then(() => this._updateTestStatus());
  }

  get currentTitle(): string {
    const {locale} = this.appState;
    let title: string;
    if (this.screen === TestingViews.ASSET_SELECTION) {
      title = locale.getString('testing.waitingForNextTest');
    } else if (this.screen === TestingViews.RECORD_AND_TEST) {
      title = locale.getString('testing.readyToTest');
    } else {
      title = this.screen;
    }
    title = this.appState.getTitle(title);
    if (title != null && isSnakeCase(title)) {
      title = replaceAll(title, '_', ' ').toLowerCase();
    }
    return title;
  }

  get sessionHistoryHasQualityScore(): boolean {
    return typeof this.lastSession?.quality_score === 'number';
  }

  get sessionHistoryQualityScoreDisplay(): string | number {
    if (this.sessionHistoryHasQualityScore) {
      return +(+this.lastSession.quality_score).toFixed(1);
    }
    return this.lastSession?.quality_score;
  }

  get sessionHistoryHasAiMsgs(): boolean {
    return !!this.lastSession?.ai_msgs?.length;
  }

  get sessionHistoryHasRdyName(): boolean {
    return !!this.lastSession?.rdy?.name;
  }

  get sessionHistoryHasRdyValue(): boolean {
    return !!this.lastSession?.rdy?.value;
  }

  get sessionHistoryHasSensors(): boolean {
    return !!this.lastSession?.sensors?.length;
  }

  @computed get currentsubTitle(): string {
    const {locale} = this.appState;
    let subtitle: string = '';
    if (this.screen === TestingViews.ASSET_SELECTION) {
      subtitle = locale.getString('testing.instructionsToStartTest');
    }
    return subtitle;
  }

  get displayedSessions() {
    return this.reviewSessionsStore?.displayedSessions;
  }

  get rowsStartingSessionNumber() {
    const {pageNum, rowsPerPage, totalFilteredSessions} = this.reviewSessionsStore;
    return totalFilteredSessions - (pageNum) * rowsPerPage;
  }

  get totalFilteredSessions() {
    return this.reviewSessionsStore.totalFilteredSessions;
  }
}
