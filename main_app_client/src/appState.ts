import LocaleStore, {LOCALES} from '@otosense/locale';
import { action, computed, IObservableArray, makeObservable, observable } from 'mobx';
import * as moment from 'moment';

import { sleep } from '../test/common';
import apiRequest, {APIS, Config, getBaseUrl, isErrorResponse/* , IUpdateStatus */} from './api';
import { handleErrorResponse, isLoading } from './util';
import { PING_DELAY, PONG } from './Utility';
import * as Toast from './Utility/Toast';

export enum View {
  LOGIN,
  DATA_COLLECTION_AND_ANALYSIS,
  REVIEW_SESSIONS,
  SETTINGS,
}

export interface ReadAddress {
  name: boolean;
  address: boolean;
  count: boolean;
}

export interface UserSession {
  access: string[];
  email: string;
  firstname: string;
  lastname: string;
  temp_pw: boolean;
  user_session_id: string;
  error?: any;
}


export default class AppState {
  TIMESTAMP_INTERVAL_ID = null;

  toastStore: Toast.ToastStore;

  @observable isUpdating: boolean = false;  // to ensure update API isn't called twice
  @observable isLoading: boolean = false;
  @observable isOnline: boolean = false;
  @observable errorMessage: string = null;

  @observable ip: string = '';
  @observable id: string = '';
  @observable version: string = '';

  @observable _VIEW: View = View.LOGIN;

  @observable account: string = '';
  @observable userSession: UserSession = null;
  @observable inputResponse = null;
  @observable inputSelection = null;

  @observable currentTimestamp: number = 0;
  // @observable syncStatus: IUpdateStatus = { last_update: 0, next_update: 0, message: '' };
  @observable syncStatusInterval: any = null;  // return value of setInterval

  // settings
  @observable show: boolean = false;
  @observable setShow: boolean = false;
  // Adding assets
  @observable assetType = null;
  @observable assetVariant = null;
  @observable assetInstance = null;
  @observable dataCollectionStoreReset: () => Promise<void> = null;

  @observable showDateTimeInUTC: boolean = false;
  @observable config: Config = null;
  @observable isLoggedInVerified: boolean = false;
  @observable touchScreenMode: boolean = false;
  @observable moveUpStyle: IObservableArray<boolean> = observable.array([]);
  @observable readAddressStyles: IObservableArray<ReadAddress> = observable.array([]);
  @observable isRegistered: boolean = true;
  @observable isSoftwareUpdating: boolean = false;

  appState: AppState;
  locale: LocaleStore;

  constructor(localeStore: LocaleStore, toastStore?: Toast.ToastStore) {
    makeObservable(this);
    this.locale = localeStore;
    this.toastStore = toastStore;
    this.appState = this;
    this.initializeAppState();
    this.TIMESTAMP_INTERVAL_ID = setInterval(this.setCurrentTimestamp, 500);
    window['appState'] = this;
  }

  /**
   * Ping Controller until response is given. Used to await server response before proceeding with other API calls.
   */
  waitForLocalServerResponse(): Promise<void> {
    return new Promise((resolve) => {
      const checkPing: VoidFunction = () => {
        apiRequest(APIS.PING).then((pingResult: any) => {
          if (pingResult === PONG) {
            this.setOnline(true);
            resolve();
          } else {
            this.setOnline(false);
            setTimeout(checkPing, PING_DELAY);
          }
        });
      };
      checkPing();
    });
  }

  @action.bound setMoveUpStyle(i: number) {
    if (this.touchScreenMode){
      this.moveUpStyle[i] = true;
    }
  }
  @action.bound addNewMoveUpStyle(){
    this.moveUpStyle.push(false);
  }
  @action.bound setReadAddressStyle(index: number, fieldName: string, state: boolean){
    const temp = [...this.readAddressStyles];
    temp[index][fieldName] = state;
    this.readAddressStyles.replace(temp);
  }
  @action.bound replaceReadAddressStyle(arr: ReadAddress[]){
    this.readAddressStyles.replace(arr);
  }
  @action.bound addNewReadAddressStyle(){
    const newObj = {name: false, address: false, count: false};
    const temp = [...this.readAddressStyles];
    temp.push(newObj);
    this.readAddressStyles.replace(temp);
  }
  @action.bound resetMoveUpStyle(i: number){
    if (this.moveUpStyle.length && this.moveUpStyle[i]){
      this.moveUpStyle[i] = false;
    }
  }
  @action.bound resetAllMoveUpStyle(){
    this.moveUpStyle.replace([]);
    this.readAddressStyles.replace([]);
  }
  @action.bound initializeMoveUpStyle(i: number){
    const temp = [...this.moveUpStyle];
    temp[i] = false;
    this.moveUpStyle.replace(temp);
  }
  @action.bound toggleTouchScreenMode(){
    this.touchScreenMode = !this.touchScreenMode;
  }

  @action.bound setCurrentTimestamp() {
    this.currentTimestamp = Date.now();
  }

  @computed get currentDateTime(): string {
    return this.formatTimestamp(this.currentTimestamp);
  }

  @action setOnline(isOnline: boolean): void {
    this.isOnline = isOnline;
  }

  // @action @handleErrorResponse receiveDefaults(defaults: { login: any }): void {
  //     this.account = defaults.login.account || this.account;
  //     this.email = defaults.login.email || this.email;
  //     this.password = defaults.login.password || this.password;
  // }
  //
  // defaults() {
  //     return apiRequest('get_defaults').then((defaults) => this.receiveDefaults(defaults));
  // }

  @action.bound getTitle(title: string | View) {
    const VIEW_TITLES = {
      [View.DATA_COLLECTION_AND_ANALYSIS]: this.locale.getString('global.testing'),
      [View.REVIEW_SESSIONS]: this.locale.getString('global.storedSessions'),
      [View.SETTINGS]: this.locale.getString('global.administration'),
    };
    if (VIEW_TITLES[title] != null) {
      return VIEW_TITLES[title];
    }
    return this.locale.getString(title as string);
  }

  @isLoading initializeAppState(): Promise<any> {
    this.setIsLoading(true);
    return this.waitForLocalServerResponse()
      .then(() => {
        this.updateID();
        this.updateIP();
        this.getVersion();
      }).then(() => this.setIsLoading(false));
  }

  @action receiveIP(ip: any): any {
    this.ip = ip;
    return ip;
  }

  updateIP(): Promise<string> {
    // return apiRequest('get_ip_address')
    return apiRequest(APIS.GET_IP_ADDRESS)
      .then((ip: any) => this.receiveIP(ip));
  }

  @action receiveID(id: any): any {
    this.id = id;
    return id;
  }

  updateID(): Promise<string> {
    // return apiRequest('get_device_id')
    return apiRequest(APIS.GET_DEVICE_ID)
      .then((id: any) => this.receiveID(id));
  }

  // resetBackend(): Promise<any> {
  //     // kill server and wait for restart
  //     // Trimble/Windows python flask restarts slower than on Linux
  //     const os = operatingSystem();
  //     const sleepTime = (os && os.indexOf('Win') !== -1) ? 15000 : 1500;
  //     return Controller.kill().then(() => sleep(sleepTime));
  // }

  @action receiveVersion(foundVersion: any): string {
    if (foundVersion === 'Unknown') {
      this.version = '1.0.beta0';
    } else {
      this.version = foundVersion as string;
    }
    return this.version;
  }

  getVersion(): Promise<string> {
    return apiRequest(APIS.GET_VERSION)
      .then((version: string) => this.receiveVersion(version));
  }

  @action.bound setLoginAccount(account: string) {
    this.account = account;
  }

  //
  // @action.bound setLoginEmail(email: string) {
  //     this.email = email;
  // }
  //
  // @action.bound setLoginPassword(password: string) {
  //     this.password = password;
  // }

  @action receiveConfig(config: Config) {
    this.config = observable(config);
    this.locale.setLocale(config?.default_locale as LOCALES || LOCALES.ENGLISH);
    return config;
  }

  getConfig: () => Promise<Config> = () =>
    apiRequest(APIS.GET_CONFIG).then((config) => this.receiveConfig(config));

  // @action receiveStatus(syncStatus): void {
  //     this.syncStatus = syncStatus;
  // }

  // updateStatus: () => Promise<any> = () =>
  //     apiRequest(APIS.UPDATE_STATUS).then((syncStatus) => this.receiveStatus(syncStatus))

  @action.bound receiveLogin(userSession: UserSession): any {
    this.isLoading = false;
    let promise: Promise<any>;
    if (!isErrorResponse(userSession)) {
      const promises: Promise<any>[] = [
        this.getConfig(),
      ];
      promise = Promise.all(promises)
        .then(action(() => {
          this.userSession = userSession;
          this.isLoggedInVerified = true;
          this.toastStore.setOpenToast(false);
          this.view = View.DATA_COLLECTION_AND_ANALYSIS;
        }));
    } else {
      const str = userSession.error;
      const replaced = str.replace(/["{}]/g, '');
      this.toastStore.addToast({
        duration: 10000,
        severity: 'warning',
        message: this.locale.getString(replaced),
      });
      promise = Promise.resolve();
    }
    return promise.then(() => {
      return userSession;
    });
  }

  @action.bound @handleErrorResponse @isLoading login(
    account: string, email: string, password: string): Promise<any> {
    this.isLoading = true;
    this.setLoginAccount(account);
    this.toastStore.addToast({
      duration: 10000,
      severity: 'info',
      message: this.locale.getString('global.loggingIn'),
    });
    return apiRequest(APIS.LOGIN, {account, email, password})
      .then(this.receiveLogin);
    // dismissToast is called when toast is added.
    // .then(() => this.toastStore.dismissToast());
  }

  // get isSyncing(): boolean {
  //     return !!this.syncStatusInterval;
  // }

  // @action.bound @handleErrorResponse sync() {
  //     return this.updateStatus()
  //     .then(() => {
  //         this.checkSyncStatus();
  //         return apiRequest(APIS.UPDATE);
  //     });
  // }

  // @action.bound @handleErrorResponse @isLoading update(): Promise<any> {
  //   if (this.isUpdating) {
  //     return Promise.resolve();
  //   }
  //   this.isUpdating = true;
  //   return apiRequest(APIS.UPDATE)
  //     .finally(action(() => {
  //       this.isUpdating = false;
  //     }));
  // }

  @action.bound logout() {
    this.userSession = null;
    this.isLoading = false;
    this.view = View.LOGIN;
    this.isLoggedInVerified = false;
    return this.initializeAppState();
  }

  @action.bound viewDataCollectionAndAnalysis() {
    this.view = View.DATA_COLLECTION_AND_ANALYSIS;
  }

  @action setIsLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  @computed get view(): View {
    return this._VIEW;
  }

  set view(nextView: View) {
    if (nextView !== this._VIEW) {
      this._VIEW = nextView;
    }
  }

  @computed get isLoggedIn(): boolean {
    return this.userSession != null;
  }

  @action.bound reviewSessions() {
    this.view = View.REVIEW_SESSIONS;
  }

  @action setView(view: View): void {
    this.view = view;
  }

  @action.bound toggleDateTimeFormat(isUTC: boolean = null) {
    if (isUTC === true || isUTC === false) {
      this.showDateTimeInUTC = isUTC;
    } else {
      this.showDateTimeInUTC = !this.showDateTimeInUTC;
    }
  }

  /**
	  * Timestamp is expected to be in milliseconds
   *
	  * @param timestamp milliseconds
	  */
  formatTimestamp(timestamp: number): string {
    if (this.showDateTimeInUTC === true) {
      return (!!timestamp) ? moment.utc(new Date(timestamp)).format('YYYY-MM-DD, HH:mm:ss') + ' -UTC'
        : '-';  // UTC
    }
    return (!!timestamp) ? moment.unix(timestamp / 1000).format('YYYY-MM-DD, HH:mm:ss') : '-';  // Local
  }

  /**
	  * Session time is expected to be in microseconds
   *
	  * @param bt microseconds
	  */
  formatSessionTime(bt: number): string {
    return this.formatTimestamp(bt / 1000);
  }

  // @action.bound checkSyncStatus(interval = 250, timeout = 60000 * 5) {
  //     this._clearSyncStatusInterval();  // ensure only one interval
  //     this.syncStatusInterval = setInterval(this._checkSyncStatus, interval);
  //     setTimeout(this._clearSyncStatusInterval, timeout);  // auto-stop
  // }

  notificationOnError(response) {
    if (isErrorResponse(response)) {
      this.toastStore.addToast({
        duration: 5000,
        severity: 'error',
        message: this.locale.getString(response.error),
      });
    }
    return response;
  }

  @action.bound launchDppBuilder() {
    apiRequest(APIS.LAUNCH_DPP_BUILDER)
      .then(() => sleep(2000))
      .then(() => window.open(`${getBaseUrl()}:8080/?email=${this.userSession.email}&user_session_id=${this.userSession.user_session_id}`, '_blank'));
  }

  // @action private _clearSyncStatusInterval() {
  //     clearInterval(this.syncStatusInterval);
  //     this.syncStatusInterval = null;
  // }

  // @action private _checkSyncStatus(): Promise<void> {
  //     // return apiRequest(APIS.UPDATE_STATUS)
  //     return apiRequest(APIS.UPDATE_STATUS)
  //     .then(action((status: IUpdateStatus) => {
  //         this.syncStatus = status;
  //         const { last_update, message } = this.syncStatus;
  //         if (status.message !== message) {
  //             let toast: Toast.IToast;
  //             if (status.message.toLowerCase().includes(this.locale.getString('literals.error'))) {
  //                 toast = {
  //                     // autohide: true,
  //                     className: 'oto-toast--error',
  //                     text: `${this.locale.getString('global.syncStatus')} ${status.message}`,
  //                 };
  //             } else {
  //                 toast = {
  //                     // autohide: true,
  //                     className: 'oto-toast--informational',
  //                     text: `${this.locale.getString('global.syncStatus')} ${status.message}`,
  //                 };
  //             }
  //             this.toastStore.addToast(toast);
  //         }
  //         if (status.last_update !== last_update) {
  //             clearInterval(this.syncStatusInterval);
  //         }
  //         this.syncStatus = status;
  //     }));
  // }
}
