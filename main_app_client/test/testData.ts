import LocaleStore from '@otosense/locale';

import { SQLBoolean } from '../src/api';
import AppState from '../src/appState';
import { availableLocales } from '../src/Utility/constants';
import PlaybackStore from '../src/Utility/Playback/playbackStore';
import ToastStore from '../src/Utility/Toast/toastStore';
import { DataCollectionStore } from '../src/Views/DataCollectionAndAnalysis';
import { ReviewSessionsStore } from '../src/Views/ReviewSessions';

export const testResults = {
  _id: 0,
  asset_channel: '',
  asset_id: '',
  asset_instance: '',
  asset_type: '',
  asset_variant: '',
  bt: 0,
  feedback: 0,
  notes: '',
  // feedback_comment: '',
  is_learning: 0 as SQLBoolean,
  is_pc_health_uploaded: 0 as SQLBoolean,
  is_uploaded: 0 as SQLBoolean,
  is_recording: false,
  pc_health: '',
  pipeline_name: '',
  quality_score: 0,
  sensor_data: '',
  session_result: {
    quality_score: 0,
    scores_per_channel: [],
  },
  threshold: 0,
};

export const testResultsData = {
  anoms: [],
  predictions: [],
};

export const testLocaleStore: LocaleStore = new LocaleStore({ rootDir: '', supportedLocales: availableLocales });
export const testToastStore: ToastStore = new ToastStore(testLocaleStore);
export const testAppState: AppState = new AppState(testLocaleStore, testToastStore);
export const testReviewSessionsStore: ReviewSessionsStore = new ReviewSessionsStore(testAppState);
export const testPlaybackStore: PlaybackStore = new PlaybackStore(testReviewSessionsStore);
export const testDataCollectionStore = new DataCollectionStore(testAppState, testReviewSessionsStore);

testAppState.dataCollectionStoreReset = testDataCollectionStore.reset;

export const dataCollectionStoreMock: any = {
  TEST_STATUS_ID: 0,
  appState:  {
    TIMESTAMP_INTERVAL_ID: 2,
    USE_LOCAL_DATA: true,
    _INITIALIZING:  {},
    _VIEW: 0,
    account: '',
    assetInstance: null,
    assetType: null,
    assetVariant: null,
    automaticSoftwareUpdates: true,
    config: undefined,
    currentTimestamp: 0,
    dataCollectionStoreReset: '',
    downloadNewModels: true,
    email: '',
    errorMessage: null,
    id: '',
    inputResponse: null,
    inputSelection: null,
    ip: '',
    isLoading: true,
    isUpdating: false,
    locale:  {
      _rootDir: '',
      locale: 'en',
      strings: null,
    },
    userSession: null,
    password: '',
    recordingDuration: null,
    setShow: false,
    settings: null,
    show: false,
    showDateTimeInUTC: false,
    syncStatus:  {
      last_update: 0,
      message: '',
      next_update: 0,
    },
    syncStatusInterval: null,
    toastStore:  {
      // baseClassName: 'oto-toast',
      // expandClassName: 'oto-toast--expand',
      isExpanded: false,
      toasts:  [],
    },
    transferAlldata: true,
    transferAssets: undefined,
    transferDataManually: false,
    transferDataOutlierScore: false,
    transferDataWithAssets: false,
    transferOutlier: 10,
    version: '',
  },
  defaultInputs:  {},
  duration: 5,
  inputScreenHistory:  [],
  inputs:  {},
  isShowingDiscardDialog: false,
  queueScreenChange: false,
  recordingResults: {_id: 0,
                     asset_channel: '',
                     asset_id: ''},
  recordingSession: null,
  recordingStart: null,
  recordingStop: null,
  resourceData: null,
  resourceFiles:  {},
  reviewSessionsStore:  {
    appState:  {
      TIMESTAMP_INTERVAL_ID: 2,
      USE_LOCAL_DATA: true,
      _INITIALIZING:  {},
      _VIEW: 0,
      account: '',
      assetInstance: null,
      assetType: null,
      assetVariant: null,
      automaticSoftwareUpdates: true,
      config: undefined,
      currentTimestamp: 0,
      dataCollectionStoreReset: [],
      downloadNewModels: true,
      email: '',
      errorMessage: null,
      id: '',
      inputResponse: null,
      inputSelection: null,
      ip: '',
      isLoading: true,
      isUpdating: false,
      locale:  {
        _rootDir: '',
        locale: 'en',
        strings: null,
      },
      userSession: null,
      password: '',
      recordingDuration: null,
      setShow: false,
      settings: null,
      show: false,
      showDateTimeInUTC: false,
      syncStatus:  {
        last_update: 0,
        message: '',
        next_update: 0,
      },
      syncStatusInterval: null,
      toastStore:  {
        // baseClassName: 'oto-toast',
        // expandClassName: 'oto-toast--expand',
        isExpanded: false,
        toasts:  [],
      },
      transferAlldata: true,
      transferAssets: undefined,
      transferDataManually: false,
      transferDataOutlierScore: false,
      transferDataWithAssets: false,
      transferOutlier: 10,
      version: '',
    },
    assets:  [],
    currentSessionChartType: 'peaks',
    displayedSessions:  [],
    filters:  {},
    loading: false,
    prevDisplayed:  [],
    rowsPerPage: 10,
    totalFilteredSessions: 0,
    uploading: false,
  },
  screenErrorMessage: null,
  screenIndex: 0,
  screenIsChanging: false,
  screenOrder:  [
    'ASSET_SELECTION',
    'RECORD_AND_TEST',
  ],
  testStatus:  {
    bt: 0,
    detected_anomalies_count: 0,
    inputs: null,
    is_learning: null,
    is_running: null,
    last_session: null,
    pipeline_name: null,
    quality_score_threshold: 5,
    start_count: null,
  },
};

export const testStores: any = {
  appState: testAppState,
  dataCollectionStore: testDataCollectionStore,
  // dataCollectionStore: dataCollectionStoreMock,
  locale: testLocaleStore,
  playbackStore: testPlaybackStore,
  reviewSessionsStore: testReviewSessionsStore,
  toastStore: testToastStore,
};
export const testRootStore: any = {
  LocaleStore: testLocaleStore,
  appState: testAppState,
  dataCollectionStore: testDataCollectionStore,
  playbackStore: testPlaybackStore,
  reviewSessionStore: testReviewSessionsStore,
  toastStore: testToastStore,
};
