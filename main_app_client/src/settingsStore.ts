import { set } from 'lodash';
import { action, computed, IObservableArray, makeObservable, observable, toJS } from 'mobx';
import { ChangeEvent } from 'react';
import apiRequest,
{ APIS, BufferReader, Fields, PipelineInfo, TestStatus } from './api';
import AppState from './appState';
import AssetTypeStore,
{
  ButtonChannel,
  ButtonConfig,
  DeviceChannel,
  DeviceConfig,
  EventHandler,
  SourceConfig,
  SourceConfigs,
  StartStop,
} from './assetTypeStore';

export enum EditConfigViews {
  ASSET_TYPE,
  DEVICE_CONFIG,
  SELECT_E_HANDLER,
  CONFIG_E_HANDLER,
}

export interface PlcConfig {
  ip_address: string;
  port_number: number;
  type: string;
  source: string;
  read_tags: ReadTag[];
  readiness: PlcRead;
  quality_score: QualityScore;
  set_learning_mode: PlcRead;
}

export interface ReadTag {
  name: string;
  address: number;
  count: number;
  trigger_type_name: string;
  trigger_value: number;
  is_readiness: boolean;
  is_asset_variant: boolean;
  is_phase: boolean;
  is_display: boolean;
}
export interface QualityScore {
  ready: PlcRead;
  value: PlcRead;
  reset_on_session_start: boolean;
}
export interface PlcRead {
  name: string;
  address: number;
  operation?: string;
  value?: number;
  trigger_type_name?: string;
  trigger_value?: number;
  reset_on_session_start?: boolean;
}

export default class SettingsStore {
  @observable pipelineInfo: PipelineInfo = null;
  @observable testStatus: TestStatus = null;
  @observable unsaved: boolean = false;
  @observable pipelineReaderOptions: IObservableArray<BufferReader> = observable.array([]);
  @observable selectedReaderName: string = '';
  @observable duration: number = 0;
  @observable currentTriggerType: string = 'timer';
  @observable continuous: number = null;
  @observable durationCount: number = 0;
  @observable isSelected: boolean = false;
  @observable startBtn: IObservableArray<string> = observable.array(['', '']);
  @observable startBtnId: string = '';
  @observable stopBtn: IObservableArray<string> = observable.array(['', '']);
  @observable stopBtnId: string = '';
  @observable interval: number = 0;
  @observable maxSessions: number = 0;
  @observable isFirstTime: boolean = true;
  @observable savedReaderName: string = '';
  @observable savedConfigs: IObservableArray<DeviceChannel> = observable.array([]);
  @observable savedConfig: DeviceChannel = { channel_name: '', channel_id: '0' };
  @observable savedPerDeviceConfig: DeviceConfig = { sample_rate: '', buffer_name: '' };
  @observable savedContinuous: number = null;
  @observable selectedPlcType: string = '';
  @observable editConfigIndex: number = 0;
  @observable read_tags: IObservableArray<ReadTag> = observable.array([{ name: '', address: 0, count: 0, trigger_type_name: '', trigger_value: null, is_readiness: false, is_asset_variant: false, is_phase: false, is_display: false }]);
  @observable readiness: PlcRead =
    { name: 'Readiness', address: null, operation: '=', value: 0, trigger_type_name: 'timer', trigger_value: null, reset_on_session_start: true };
  @observable sessionBt: EventHandler =
    { source: 'plc', tag: 'Session Start', address: null, operation: '', value: 0 };
  @observable sessionTt: EventHandler = { source: 'plc', tag: 'Session End', address: null, operation: '', value: 0 };
  @observable quality_score: QualityScore =
    { ready: { name: 'QualityScore-Ready',address: null, operation: '=', value: null }, value: { name: 'QualityScore-Value', address: null, operation: '=' }, reset_on_session_start: true };
  @observable plc_cfg: PlcConfig = {
    ip_address: '',
    port_number: 502,
    type: 'plc',
    source: '',
    read_tags: [],
    readiness: null,
    quality_score: null,
    set_learning_mode: null,
  };
  @observable trigger_value: number = null;
  @observable isLearningMode: boolean = false;
  @observable set_learning_mode: PlcRead = {
    name: 'LearningMode',
    address: null,
    operation: '==',
    value: null
  };
  @observable disableNext: boolean = true;
  // @observable selectedReader: BufferReader = null;
  // @observable perDeviceFields: IObservableArray<Fields> = observable.array([]);
  @observable timerHelperTexts: IObservableArray<string> = observable.array(['', '', '']);
  @observable saveBtnDisabled: boolean = false;

  appState: AppState;
  assetTypeStore: AssetTypeStore;

  constructor(appState: AppState, assetTypeStore: AssetTypeStore) {
    this.appState = appState;
    this.assetTypeStore = assetTypeStore;
    makeObservable(this);
    window['settingsStore'] = this;
  }

  @action.bound setSaveBtnDisabled(state: boolean){
    this.saveBtnDisabled = state;
  }

  @action.bound resetDeviceSettings(): void {
    this.selectedReaderName = '';
    this.assetTypeStore.configs.replace([]);
    this.assetTypeStore.config = observable({ channel_name: '', channel_id: '0' });
    this.assetTypeStore.perDeviceConfigs = observable({ sample_rate: '', buffer_name: '' });
    this.assetTypeStore.fieldOptions.replace([]);
    this.duration = 0;
    // this.continuous = null;
    this.startBtn.replace(['', '']);
    this.stopBtn.replace(['', '']);
    this.interval = 0;
    this.maxSessions = 0;
    this.isFirstTime = true;
    this.editConfigIndex = 0;
    this.read_tags.replace([{ name: '', address: null, count: null, trigger_type_name: '', trigger_value: null, is_readiness: false, is_asset_variant: false, is_phase: false, is_display: false }]);
    this.readiness = observable(
      { name: 'Readiness', address: null, operation: '=', value: null, trigger_type_name: '', trigger_value: null,  reset_on_session_start: true },
    );
    this.quality_score = observable({ ready: { name: 'QualityScore-Ready',address: null, operation: '=', value: null }, value: { name: 'QualityScore-Value', address: null, operation: '=' }, reset_on_session_start: true });
    this.currentTriggerType = 'timer';
    this.sessionBt = observable({ source: 'plc', tag: 'Session Start', address: null, operation: '', value: 0 });
    this.sessionTt = observable({ source: 'plc', tag: 'Session End', address: null, operation: '', value: 0 });
    this.trigger_value = null;
    this.plc_cfg = {
      ip_address: '',
      port_number: 502,
      type: 'plc',
      source: '',
      read_tags: [],
      readiness: null,
      quality_score: null,
      set_learning_mode: null,
    };
    this.isLearningMode = false;
    this.appState.resetAllMoveUpStyle();
  }

  @action.bound setDisabledNext(state: boolean){
    this.disableNext = state;
  }

  @action.bound toggleIsLearningMode(){
    this.isLearningMode = !this.isLearningMode;
  }
  @action.bound setLearningMode(fieldName: string, val: string | number){
    this.set_learning_mode[fieldName] = val;
  }

  @action.bound setTriggerValue(num: number){
    this.trigger_value = num;
    this.sessionBt.trigger_value = num;
    this.sessionTt.trigger_value = num;
    for (const i in this.read_tags) {
      if (this.read_tags[i].trigger_value){
        this.read_tags[i].trigger_value = num;
      }
    }
  }
  @action.bound setSelectedPlcType(type: string) {
    this.selectedPlcType = type;
  }
  @action.bound setEditConfigIndex(num: number) {
    this.editConfigIndex = num;
  }
  @action.bound nextEditConfig() {
    this.editConfigIndex = this.editConfigIndex + 1;
  }
  @action.bound setQsReady(fieldName: string, val: string | number) {
    this.quality_score.ready[fieldName] = val;
  }
  @action.bound setQsValue(fieldName: string, val: number | string) {
    this.quality_score.value[fieldName] = val;
  }
  @action.bound setPlcTags(i: number, name: string, val: number | string) {
    this.read_tags[i][name] = val;
  }
  @action.bound replacePlcTags(tags: ReadTag[]){
    this.read_tags.replace(tags);
  }
  @action.bound setPlcTagsWithKey(key: string, parentIndex: number, state: boolean){
    const temp = this.read_tags;
    temp[parentIndex][key] = state;
    if (key !== 'is_display'){
      temp.forEach((tag, i) => {
        if (tag[key] && i !== parentIndex){
          temp[i][key] = false;
        }
      });
    }
    this.read_tags.replace(temp);
  }

  @action.bound setPlcReadiness(fieldName: string, val: string | number | boolean) {
    this.readiness[fieldName] = val;
  }
  @action.bound setSessionBt(fieldName: string, val: string | number) {
    this.sessionBt[fieldName] = val;
  }
  @action.bound setSessionTt(fieldName: string, val: string | number) {
    this.sessionTt[fieldName] = val;
  }
  @action.bound setPlcConfig(fieldName: string, val: number | string | PlcRead) {
    this.plc_cfg[fieldName] = val;
  }
  @action.bound setTimerValues(e: ChangeEvent<HTMLInputElement>, index: number): void {
    let val = +e.target.value;
    if (val < 0 || isNaN(val)){
      val = 0;
    }
    switch (index) {
    case 0:
      if (val < 1){
        val = null;
      }
      this.duration = val;
      break;
    case 1:
      this.interval = val;
      break;
    case 2:
      this.maxSessions = val;
      break;
    default:
      return null;
    }
  }

  @action.bound setIsSelected(state: boolean): void {
    this.isSelected = state;
  }

  @action.bound setSavedConfigs(configs: DeviceConfig[]): void {
    this.savedConfigs.replace(configs);
  }

  @action.bound setSavedConfig(fieldName: string, val: string): void {
    this.savedConfig[fieldName] = val;
  }

  @action.bound setSavedPerdeviceConfig(field: Fields): void {
    this.savedPerDeviceConfig[field.name as string] = field.default ? field.default + '' : field.values[0] + '';
  }

  @action.bound replaceSavedPerDeviceConfigs(configs: SourceConfigs): void {
    this.savedPerDeviceConfig = observable(configs);
  }

  @action.bound setSelectedReaderName(name: string): void {
    this.selectedReaderName = name;
    if (name === this.savedReaderName) {
      // this.continuous = this.savedContinuous;
      this.assetTypeStore.replacePerDeviceConfigs(this.savedPerDeviceConfig);
    } else {
      const initialValues = {sample_rate: '', buffer_name: '', sensor: ''};
      this.assetTypeStore.replacePerDeviceConfigs(initialValues);
      this.assetTypeStore.config = observable({ channel_name: '', channel_id: '0' });
    }
    if (!this.isSelected) {
      this.setIsSelected(true);
    }
  }


  @action.bound setSettingsConfig(val: string | boolean | number, fieldName: string) {
    set(this.appState.config, fieldName, val);
  }

  @action.bound receivePipelineInfo(info: PipelineInfo): void {
    this.pipelineInfo = observable(info);
  }

  @action.bound receiveTestStatus(status: TestStatus): void {
    this.testStatus = observable(status);
  }

  @action toastGenericError(error: string): void {
    this.appState.toastStore.addToast({
      duration: 5000,
      message: this.appState.locale.getString(error),
      severity: 'error',
    });
  }

  @action.bound loadPipelineAndTestStatus(): void {
    apiRequest(APIS.LATEST_PIPELINE_INFO)
      .then((apiResult: any) => {
        if (apiResult && apiResult.error) {
          this.toastGenericError(apiResult.error);
        } else {
          this.receivePipelineInfo(apiResult);
        }
      });
    apiRequest(APIS.TEST_STATUS, {user_session_id: this.appState.userSession?.user_session_id})
      .then((apiResult: any) => {
        if (apiResult && apiResult.error) {
          this.toastGenericError(apiResult.error);
        } else {
          this.receiveTestStatus(apiResult);
        }
      });
  }
  @action previousSettingsButton(previousCfg: StartStop){
    let startBtnState: string = '';
    let stopBtnState: string = '';
    const red = `${this.appState.locale.getString('settings.button1')} ( ${this.appState.locale.getString('settings.red')} )`;
    const blue = `${this.appState.locale.getString('settings.button2')} ( ${this.appState.locale.getString('settings.blue')})`;
    if (previousCfg.bt.id === '0') {
      startBtnState = red;
    } else if (previousCfg.bt.id === '1') {
      startBtnState = blue;
    }
    this.setStartBtn(startBtnState, 0);
    this.setStartBtn(previousCfg.bt.operations, 1);
    if (previousCfg.tt.id === '0') {
      stopBtnState = red;
    } else if (previousCfg.tt.id === '1') {
      stopBtnState = blue;
    }
    this.setStopBtn(stopBtnState, 0);
    this.setStopBtn(previousCfg.tt.operations, 1);
  }
  @action previousSettingsTimer(eventReader: SourceConfigs){
    this.interval = (+eventReader.session_start_stop_cfg.bt.value)
    - (+eventReader.session_start_stop_cfg.tt.value);
    this.maxSessions = eventReader.session_start_stop_cfg.bt.count;
    this.duration = +eventReader.session_start_stop_cfg.tt.value;
  }
  @action previousSettingsPlc(eventReader: SourceConfigs){
    const { plc_cfg, session_start_stop_cfg} = eventReader;
    this.plc_cfg.ip_address = plc_cfg.ip_address;
    this.plc_cfg.port_number = plc_cfg.port_number;
    this.plc_cfg.set_learning_mode = plc_cfg.set_learning_mode;
    this.plc_cfg.source = plc_cfg.source;
    this.plc_cfg.type = plc_cfg.type;
    this.read_tags.replace(plc_cfg.read_tags);
    this.readiness = plc_cfg.readiness;
    if (plc_cfg.quality_score){
      this.quality_score = plc_cfg.quality_score;
      this.isLearningMode = false;
    } else if (plc_cfg.set_learning_mode){
      this.isLearningMode = true;
      this.set_learning_mode = plc_cfg.set_learning_mode;
    }
    this.sessionBt = session_start_stop_cfg.bt;
    this.sessionTt = session_start_stop_cfg.tt;
    this.trigger_value = session_start_stop_cfg.bt.trigger_value;
  }

  @action.bound receivePipelineReaderOptions(options: BufferReader[]): void {
    this.pipelineReaderOptions = observable(options);
  }

  @action.bound formatConfigData(): void {
    let latestConfigs: SourceConfigs[] = [];
    const bufferReaders: BufferReader[] = toJS(this.pipelineReaderOptions);
    if (this.assetTypeStore.selectedChannel && this.assetTypeStore.selectedChannel.definition) {
      latestConfigs =
        this.assetTypeStore.selectedChannel.definition.source_configs;
      if (latestConfigs) {
        const eventReader =
            latestConfigs.find((reader: SourceConfigs) => reader.buffer_name === 'events_buffer_reader');
        if (eventReader) {
          const previousCfg = eventReader.session_start_stop_cfg;
          this.currentTriggerType = previousCfg.bt.source;
          if (this.currentTriggerType === 'button') {
            this.previousSettingsButton(previousCfg);
          } else if (this.currentTriggerType === 'timer') {
            this.previousSettingsTimer(eventReader);
          } else if (this.currentTriggerType === 'plc'){
            this.previousSettingsPlc(eventReader);
          }
        }
        const deviceReader = latestConfigs.find((reader: SourceConfigs) => reader.buffer_name !== 'event_buffer_reader'
            && reader.buffer_name !== 'session_buffer_reader') as SourceConfigs;
        const sessionReader =
            latestConfigs.find((reader: SourceConfigs) => reader.buffer_name === 'session_buffer_reader');
        if (sessionReader) {
          console.log('sessionReader is outdated', sessionReader);
        }
        if (deviceReader) {
          if (this.isFirstTime) {
            this.savedContinuous = deviceReader.continuous;
          }
          // this.continuous = deviceReader.continuous;
          this.assetTypeStore.setConfigs(deviceReader.device_channels);
          this.setSavedConfigs(deviceReader.device_channels);
          const currentBuffer = bufferReaders.find((reader) =>
            reader.buffer_name === deviceReader.buffer_name);
          this.setSelectedReaderName(currentBuffer.name);
          this.savedReaderName = currentBuffer.name;
          const perDeviceConfigsDB = Object.keys(deviceReader)
            .filter((key) => key === 'sample_rate' || key === 'sensor')
            .reduce((obj, key) => {
              obj[key] = deviceReader[key] + '';
              return obj;
            }, {});
          this.assetTypeStore.replacePerDeviceConfigs(perDeviceConfigsDB);
          this.replaceSavedPerDeviceConfigs(perDeviceConfigsDB);
        }
        if (deviceReader.buffer_name === 'audio_buffer_reader') {
          if (deviceReader.device_channels) {
            this.assetTypeStore.setConfig('channel_name', deviceReader.device_channels[0].channel_name);
            this.setSavedConfig('channel_name', deviceReader.device_channels[0].channel_name);
          }
          this.assetTypeStore.perDeviceConfigs.sample_rate = deviceReader.sample_rate;
        }
      }
    }

    this.isFirstTime = false;
  }

  @action.bound pipelineConfigOptions(): Promise<void> {
    return apiRequest(APIS.LIST_READERS)
      .then((res) => {
        this.receivePipelineReaderOptions(res);
        this.formatConfigData();
      });
  }

  @action.bound setDurationCount(e: any): void {
    let num: number;
    if (e.target) {
      num = +e.target.value;
    } else {
      num = e;
    }
    this.durationCount = num;
  }

  @action.bound setCurrentTriggerType(e: ChangeEvent<HTMLInputElement>): void {
    this.currentTriggerType = e.target.value;
    if (this.currentTriggerType === 'plc' && !this.plc_cfg.ip_address){
      this.setDisabledNext(true);
    }
  }

  @action.bound setStartBtn(val: any, index: number): void {
    this.startBtn[index] = val;
    if (this.startBtn[0].includes('red')) {
      this.startBtnId = '0';
    } else {
      this.startBtnId = '1';
    }
  }

  @action.bound setStopBtn(val: any, index: number): void {
    const copy = [...this.stopBtn];
    copy[index] = val;
    this.stopBtn.replace(copy);
    if (this.stopBtn[0].includes('red')) {
      this.stopBtnId = '0';
    } else {
      this.stopBtnId = '1';
    }
  }

  @action.bound saveOTASettings(): void {
    const automatic_software_updates = !!this.appState.config.automatic_software_updates;
    if (automatic_software_updates) {
      apiRequest(APIS.CHECKED_UPDATES)
        .then((t) => console.log(t));
    } else {
      apiRequest(APIS.UNCHECKED_UPDATES)
        .then((t) => console.log(t));
    }
    apiRequest(APIS.SAVE_OTA_SETTINGS)
      .then((t) => console.log(t));
    apiRequest(APIS.SET_CONFIG, {new_config: {automatic_software_updates}});
  }

  formatForUsbBtn() {
    const eventBtButton: EventHandler = {
      id: this.startBtnId,
      operations: this.startBtn[1],
      source: this.currentTriggerType,
    };
    const eventTtButton: EventHandler = {
      id: this.stopBtnId,
      operations: this.stopBtn[1],
      source: this.currentTriggerType,
    };
    const startAndStop: StartStop = {
      bt: eventBtButton,
      tt: eventTtButton,
      type: 'session',
    };
    const buttonChannels: ButtonChannel[] = [{ name: 'red', id: '0' }, { name: 'blue', id: '1' }];
    const buttonConfig: ButtonConfig = {
      channels: buttonChannels,
      source: 'delcom', // currently only one
      type: 'button',
    };
    return { startAndStop, buttonConfig };
  }
  formatForTimer() {
    const eventBtTimer: EventHandler = {
      count: this.maxSessions,
      value: this.periodicity,
      source: 'timer',
    };
    const eventTtTimer: EventHandler = {
      count: this.maxSessions,
      value: this.duration,
      source: 'timer',
    };
    const startAndStop: StartStop = {
      bt: eventBtTimer,
      tt: eventTtTimer,
      type: 'session',
    };
    return startAndStop;
  }

  @action formatForPlc() {
    this.sessionBt.source = 'plc';
    this.sessionTt.source = 'plc';
    this.sessionBt.trigger_type_name = 'timer';
    this.sessionTt.trigger_type_name = 'timer';
    const startAndStop: StartStop = {
      bt: this.sessionBt,
      tt: this.sessionTt,
      type: 'session',
    };
    return startAndStop;
  }
  makeSaveConfigApiCall(pipelineConfig: SourceConfig){
    this.assetTypeStore.saveConfig(pipelineConfig)
      .then((res) => {
        console.log('res', res);
        this.resetDeviceSettings();
        this.assetTypeStore.fetchAssetTypes();
      });
  }
  saveConfigForSoundcard(configObj: DeviceConfig, pipelineConfig: SourceConfig, eventObj: SourceConfigs) {
    const deviceChannelConfig = {...this.assetTypeStore.config, channel_selected: true};
    const temp = this.assetTypeStore.perDeviceConfigs.sample_rate;
    configObj.sample_rate = +temp;
    configObj.device_channels = [deviceChannelConfig];
    pipelineConfig.source_configs = [configObj, eventObj];
    this.makeSaveConfigApiCall(pipelineConfig);
  }
  saveConfigForGalileo(configObj: DeviceConfig, pipelineConfig: SourceConfig, eventObj: SourceConfigs) {
    const deviceChannelConfigs = this.selectedReader.channel_ids.map((id, i) => {
      return ({
        channel_id: id,
        channel_name: this.selectedReader.channel_names[i],
        broker_address: this.assetTypeStore.config.broker_ip_address,
        broker_port: +this.assetTypeStore.config.broker_port,
        topic: this.assetTypeStore.config.topic,
        channel_selected: true,
      });
    });
    configObj.sample_rate = +this.assetTypeStore.perDeviceConfigs.sample_rate;
    configObj.sensor = 'Galileo';
    configObj.buffer_name = this.selectedReader.buffer_name;
    configObj.device_channels = deviceChannelConfigs;
    pipelineConfig.source_configs = [configObj, eventObj];
    this.makeSaveConfigApiCall(pipelineConfig);
  }
  saveConfigForRestDevices(configObj: DeviceConfig, pipelineConfig: SourceConfig, eventObj: SourceConfigs){
    const temp = configObj.sample_rate;
    configObj.sample_rate = +temp;
    configObj.device_channels = [...this.assetTypeStore.configs];
    pipelineConfig.source_configs = [configObj, eventObj];
    this.makeSaveConfigApiCall(pipelineConfig);
  }

  @action.bound saveConfig(): void {
    const copiedReadTags = toJS(this.read_tags);
    this.isSelected = false;
    const eventObj: SourceConfigs = {
      buffer_name: 'events_buffer_reader',
    };
    switch (this.currentTriggerType) {
    case 'button':
      const { startAndStop, buttonConfig } = this.formatForUsbBtn();
      eventObj.session_start_stop_cfg = startAndStop;
      eventObj.buttons_cfg = buttonConfig;
      break;
    case 'timer':
      const formattedTimer = this.formatForTimer();
      eventObj.session_start_stop_cfg = formattedTimer;
      break;
    case 'plc':
      const formattedPlc = this.formatForPlc();
      eventObj.session_start_stop_cfg = formattedPlc;
      this.plc_cfg.read_tags = copiedReadTags;
      this.plc_cfg.readiness = this.readiness;
      if (this.isLearningMode){
        this.plc_cfg.set_learning_mode = this.set_learning_mode;
        this.plc_cfg.quality_score = null;
      } else {
        this.plc_cfg.set_learning_mode = null;
        this.plc_cfg.quality_score = this.quality_score;
      }
      eventObj.plc_cfg = this.plc_cfg;
      break;
    default:
      break;
    }
    const pipelineConfig: SourceConfig = {
      asset_type_id: this.assetTypeStore.selectedAssetType._id,
      channel_id: this.assetTypeStore.selectedChannel._id,
      dpp_id: '',
      variant_id: this.assetTypeStore.selectedVariant._id,
    };

    const configObj: SourceConfigs = {
      buffer_name: this.selectedReader.buffer_name,
      sample_rate: null,
      device_channels: [this.assetTypeStore.config],
    };
    Object.keys(this.assetTypeStore.perDeviceConfigs).map((key) => {
      if (key !== 'device_channels' && key !== 'buffer_name') {
        configObj[key] = this.assetTypeStore.perDeviceConfigs[key];
      }
    });

    if (this.selectedReader.name === 'soundcard') {
      this.saveConfigForSoundcard(configObj, pipelineConfig, eventObj);
    } else if (this.selectedReader.name === 'Galileo') {
      this.saveConfigForGalileo(configObj, pipelineConfig, eventObj);
    } else {
      this.saveConfigForRestDevices(configObj, pipelineConfig, eventObj);
    }
  }

  @computed get deviceOptions(): string[] {
    if (this.pipelineReaderOptions) {
      return this.pipelineReaderOptions.filter((reader) => reader.type === 'device')
        .map((obj) => obj.name);
    }
  }

  @computed get periodicity(): number {
    return this.duration + this.interval;
  }

  @computed get selectedReader(): BufferReader {
    if (!!this.pipelineReaderOptions.length && this.selectedReaderName) {

      return this.pipelineReaderOptions.find((reader) => reader.name === this.selectedReaderName);
    } else {
      return null;
    }
  }

  @computed get perDeviceFields(): Fields[] {
    if (this.selectedReader) {
      return this.selectedReader.fields.filter((field) => field.is_per_device_channel !== true);
    } else {
      return [];
    }
  }

}
