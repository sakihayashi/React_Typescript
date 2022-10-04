import LocaleStore from '@otosense/locale';
import {action, computed, makeObservable, observable} from 'mobx';
import * as moment from 'moment';

import apiRequest, {APIS, DppRecord, isErrorResponse} from './api';
import {isLoading} from './util';
import {PING_DELAY, PONG} from './Utility';
import * as Toast from './Utility/Toast';

export enum View {
  DPP_LIST,
  WIZARD_MAIN,
  REVIEW_SESSIONS,
  SETTINGS,
}

export default class AppState {
  TIMESTAMP_INTERVAL_ID = null;

  toastStore: Toast.ToastStore;
  appState: AppState;
  locale: LocaleStore;

  @observable isLoading: boolean = false;
  @observable version: string = '';
  @observable config = null
  @observable _VIEW: View = View.DPP_LIST;
  @observable currentTimestamp: number = Date.now();
  @observable showDateTimeInUTC: boolean = false;
  @observable isAgreed: boolean = false;
  @observable dppRecords: DppRecord[] = [];

  constructor(localeStore: LocaleStore, toastStore?: Toast.ToastStore) {
    makeObservable(this);
    this.locale = localeStore;
    this.toastStore = toastStore;
    this.initializeAppState();
    this.TIMESTAMP_INTERVAL_ID = setInterval(this.setCurrentTimestamp, 500);
    window['appState'] = this;
    this.appState = this;
  }

  @action.bound receiveDppRecords(dppRecords: any): void {
    console.log({dppRecords});
    this.dppRecords = dppRecords;
  }

  @action.bound setDppRecords() {
    return apiRequest(APIS.LIST_DPP_BUILDS)
    .then(this.receiveDppRecords);
  }

  /**
   * Ping Controller until response is given. Used to await server response before proceeding with other API calls.
   */
  waitForLocalServerResponse(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkPing: VoidFunction = () => {
        apiRequest(APIS.PING).then((pingResult: any) => {
          if (pingResult === PONG) {
            resolve();
          } else {
            setTimeout(checkPing, PING_DELAY);
          }
        });
      };
      checkPing();
    });
  }

  @action.bound setCurrentTimestamp() {
    this.currentTimestamp = Date.now();
  }

  @action.bound agreeToTerms() {
    this.isAgreed = true;
  }

  @computed get currentDateTime(): string {
    return this.formatTimestamp(this.currentTimestamp);
  }

  @action.bound getTitle(title: string | View) {
    const VIEW_TITLES = {
      [View.DPP_LIST]: this.locale.getString('global.testing'),
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
      this.getVersion();
      return this.getConfig();
    }).then(() => this.setIsLoading(false))
    .then(this.setDppRecords);
  }

  @action.bound getVersion(): Promise<string> {
    return apiRequest(APIS.GET_VERSION)
    .then((foundVersion: string) => {
      if (foundVersion === 'Unknown') {
        this.version = '1.0.beta0';
      } else {
        this.version = foundVersion as string;
      }
      return this.version;
    });
  }

  @action.bound getConfig(): Promise<string> {
    return apiRequest(APIS.GET_CONFIG).then((config) => this.config = config);
  }

  get account(): string {
    return this.config?.account
  }

  @action.bound logout() {
    this.isLoading = false;
    return this.initializeAppState();
  }

  @action.bound closeApp() {
    return apiRequest(APIS.STOP_DPP_BUILDER).then(window.close);
  }

  @action.bound startWizard() {
    this.view = View.WIZARD_MAIN;
  }

  @action.bound backToDppList() {
    this.view = View.DPP_LIST;
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

  @computed get configIsSet(): boolean {
    return this.config != null;
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
      return (!!timestamp) ? moment.utc(new Date(timestamp)).format('YYYY-MM-DD, hh:mm:ss A Z') : '-';  // UTC
    }
    return (!!timestamp) ? moment.unix(timestamp / 1000).format('YYYY-MM-DD, hh:mm:ss A Z') : '-';  // Local
  }

  /**
   * Session time is expected to be in microseconds
   *
   * @param bt microseconds
   */
  formatSessionTime(bt: number): string {
    return this.formatTimestamp(bt / 1000);
  }

  notificationOnError(response) {
    if (isErrorResponse(response)) {
      this.toastStore.addToast({
        duration: 5000,
        severity: 'error',
        message: response.error,
      });
    }
    return response;
  }
}
