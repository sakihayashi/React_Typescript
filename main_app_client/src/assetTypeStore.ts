import LocaleStore from '@otosense/locale';
import _, { get } from 'lodash';
import { action, computed, IObservableArray, makeObservable, observable, when } from 'mobx';
import apiRequest, { APIS, Fields } from './api';
import AppState from './appState';
import { PlcConfig } from './settingsStore';

export interface AssetType {
  _id: string;
  name: string;
  variants: IObservableArray<AssetVariant>;
}

export interface AssetVariant {
  _id: string;
  channels: IObservableArray<QCChannel>;
  [fieldName: string]: any;
}

export interface QCChannel {
  _id: string;
  name: string;
  definition?: { source_configs: SourceConfigs[] };
  dpp_id?: string;
  dpp_build_time?: number;
  [fieldName: string]: any;
}

export interface SourceConfig {
  asset_type_id: string;
  channel_id: string;
  dpp_id?: string;
  source_configs?: SourceConfigs[];
  // source_configs?: [DeviceConfig, EventConfig];
  variant_id: string;
}

export interface SourceConfigs {
  buffer_name?: string;
  device_channels?: DeviceChannel[];
  device?: string;
  duration?: number;
  sample_rate?: number | string;
  continuous?: number;
  buttons_cfg?: ButtonConfig;
  plc_cfg?: PlcConfig;
  session_start_stop_cfg?: StartStop;
}

export interface StartStop {
  bt: EventHandler;
  tt: EventHandler;
  type: string;
}

export interface EventHandler {
  id?: string;
  operations?: string;
  operation?: string;
  count?: number;
  value?: number | string;
  source: string;
  tag?: string;
  address?: number;
  trigger_type_name?: string;
  trigger_value?: number;
}

export interface ButtonConfig {
  channels: ButtonChannel[];
  source: string;
  type: string;
}

export interface ButtonChannel {
  id: string;
  name: string;
}

export interface DeviceChannel {
  channel_name?: string;
  channel_id?: string;
  iepe?: boolean;
  coupling?: string;
  mode?: string;
  range?: string;
  channel_selected?: boolean;
  broker_ip_address?: string;
  broker_port?: number;
  topic?: string;
}

export interface DeviceConfig {
  sample_rate?: number | string;
  channel_name?: string; // for soundcard
  device_channels?: DeviceChannel[]; // array of AI config
  buffer_name?: string;
  sensor?: string; // for soundcard
  continuous?: number;
}

export interface NameAndDpp {
  name: string;
  dpp_id: string;
  dpp_build_time: number;
}

export default class AssetTypeStore {
  @observable assetTypes: IObservableArray<AssetType> = observable.array([]);
  @observable instanceName: string = '';
  @observable selectedAssetType: AssetType = null;
  @observable selectedChannel: QCChannel = null;
  @observable selectedVariant: AssetVariant = null;
  @observable allUpdated: boolean = false;
  @observable config: DeviceChannel = {channel_name: '', channel_id: '0'};
  @observable eventConfig: SourceConfigs = null;
  @observable configs: IObservableArray<DeviceChannel> = observable.array([]);
  @observable perDeviceConfigs: DeviceConfig = {sample_rate: '', buffer_name: '', sensor: ''};
  @observable fieldOptions: IObservableArray<(string[] | number[])[]> = observable.array([]);
  @observable assetTypeName: string = '';
  @observable assetVariantName: string = '';
  @observable selectedDppBuiltTime: number = null;
  @observable hasPlcConfig: boolean = false;
  @observable plcAutoSelect: boolean = false;

  appState: AppState;
  locale: LocaleStore;

  constructor(appState: AppState, localeStore: LocaleStore) {
    this.appState = appState;
    this.locale = localeStore;
    makeObservable(this);
    window['assetTypeStore'] = this;
    when(() => appState.isLoggedIn, this.fetchAssetTypes);
  }

  @action.bound setAssetTypeName(val: string) {
    if (!!val && val !== ''){
      this.assetTypeName = val;
      this.selectAssetTypeByName(val);
    }
  }
  @action.bound resetRecordingSettings(){
    this.hasPlcConfig = false;
    this.plcAutoSelect = false;
  }

  @action.bound setSelectedDppBuiltTime(val: number | null) {
    this.selectedDppBuiltTime = val;
  }

  @action.bound setAssetVariantName(val: string) {
    if (this.plcAutoSelect){
      this.selectedVariant = null;
    } else {
      this.selectVariantById(val);
    }
    this.assetVariantName = val;
  }
  @action.bound setPlcAutoSelect(state: boolean){
    this.plcAutoSelect = state;
    this.selectedVariant = null;
  }

  @action.bound resetSelected(): void {
    this.selectedAssetType = null;
    this.selectedChannel = null;
    this.selectedVariant = null;
  }

  @action.bound resetConfigs(): void {
    this.eventConfig = null;
  }

  @action.bound setFieldOptions(options: (string[] | number[])[][]): void {
    this.fieldOptions.replace(options.map((option) => observable.array(option)));
  }

  @action.bound replaceEventConfig(config: SourceConfigs): void {
    this.eventConfig = config;
  }

  @action.bound setConfig(fieldName: string, value?: string): void {
    this.config[fieldName] = value;
  }

  @action.bound setConfigs(arr: DeviceChannel[] | []): void {
    this.configs.replace(arr);
  }

  @action.bound replacePerDeviceConfigs(configs: DeviceConfig) {
    this.perDeviceConfigs = observable(configs);
  }

  @action.bound setPerDeviceConfigs(field: Fields, value?: string): void {
    if (value) {
      this.perDeviceConfigs[field.name as string] = value;
    } else {
      this.perDeviceConfigs[field.name as string] = field.default ? field.default : (field.values[0] ? field.values[0] : '');
    }
  }

  @action.bound handleSelect(fieldName: string, value: string): void {
    this.perDeviceConfigs[fieldName] = value;
  }

  @action.bound setSelectedAssetType(assetType: AssetType) {
    this.selectedAssetType = observable(assetType);
  }

  @action.bound receiveAssetTypes(assetTypes: AssetType[]) {
    const selectedVariant: AssetVariant = this.selectedVariant;
    const selectedChannel: QCChannel = this.selectedChannel;
    this.assetTypes.replace(assetTypes.sort((a, b) => this.compareAlphabetical(a.name, b.name)));
    if (this.selectedAssetType) {
      this.selectAssetTypeById(this.selectedAssetType._id);
      if (selectedVariant) {
        this.selectVariantById(selectedVariant._id);
        if (selectedChannel) {
          this.selectChannelByName(selectedChannel.name);
        }
      }
    }
  }

  @action.bound receiveAssetTypeToAddNew(assetTypes: AssetType[], assetTypeName: string) {
    this.assetTypes.replace(assetTypes);
    const selectedAssetType: AssetType = assetTypes.find((assetType: AssetType) =>
      assetType.name === assetTypeName);
    if (selectedAssetType !== this.selectedAssetType) {
      this.selectedAssetType = selectedAssetType || null;
    }
    return selectedAssetType;
  }

  @action.bound fetchAssetTypes() {
    return apiRequest(APIS.LIST_ASSET_TYPE, {})
      .then(this.receiveAssetTypes);
  }

  @action.bound fetchAssetTypesToAddNew(assetTypeName?: string) {
    return apiRequest(APIS.LIST_ASSET_TYPE, {})
      .then((res) => this.receiveAssetTypeToAddNew(res, assetTypeName));
  }

  @action.bound saveConfig(source_configs: SourceConfig) {
    return apiRequest(APIS.SET_PIPELINE_CONFIG, source_configs).then(() => {
      this.fetchAssetTypes();
      // this.setIsAllSelectedFalse();
    });
  }

  @action.bound selectAssetType(assetType: AssetType, fillDefaults?: boolean): void {
    if (assetType !== this.selectedAssetType) {
      this.selectedAssetType = assetType || null;
      if (!fillDefaults) {
        this.selectedVariant = null;
        this.selectedChannel = null;
      } else {
        // const variant: AssetVariant = assetType.variants[0];
        const variant = get(assetType, 'variants[0]', null);
        if (variant) {
          this.selectedVariant = variant;
          if (variant.channels.length) {
            this.selectedChannel = variant.channels[0];
            if (variant.channels[0].dpp_id) {
              this.setSelectedDppBuiltTime(variant.channels[0].dpp_build_time);
            }
          }
        }
      }
    }
  }

  @action.bound selectAssetTypeByName(assetTypeName: any, fillDefaults?: boolean): void {
    const selectedAssetType: AssetType = this.assetTypes.find((assetType: AssetType) =>
      assetType.name === assetTypeName);
    // if selected type has plc config
    const isPlc = selectedAssetType.variants.find(variant => variant.channels.find((channel) => {
      if (channel.definition.source_configs){
        return channel.definition.source_configs.find((config) => config.hasOwnProperty('plc_cfg'));
      }
    }));
    if (isPlc){
      this.hasPlcConfig = true;
    }

    return this.selectAssetType(selectedAssetType, fillDefaults);
  }

  @action.bound selectAssetTypeById(id: string, fillDefaults?: boolean): void {
    const selectedAssetType: AssetType = this.assetTypes.find((assetType: AssetType) =>
      assetType._id === id);
    return this.selectAssetType(selectedAssetType, fillDefaults);
  }

  @action.bound selectVariant(receivedVariant: AssetVariant): void {
    const selectedVariant: AssetVariant = this.selectedAssetType.variants.find((variant: AssetVariant) =>
      variant._id === receivedVariant._id);
    if (selectedVariant) {
      this.selectedVariant = observable(selectedVariant);
      if (selectedVariant.channels.length) {
        this.selectedChannel = observable(selectedVariant.channels[0]);
      } else {
        this.selectedChannel = null;
      }

      const selectedChannel = this.selectedVariant.channels.find((channel) => channel._id === this.selectedChannel._id);

      if (selectedChannel) {
        this.selectedChannel = observable(selectedChannel);
      } else {
        console.log('fix this bug');
      }
    }
  }

  @action.bound clearSelectedVariant(): void {
    this.selectedVariant = null;
  }

  @action.bound selectVariantById(variantId: string, fillDefaults?: boolean): void {
    if (!this.selectedAssetType) {
      return;
    }
    const selectedVariant: AssetVariant = this.selectedAssetType.variants.find((variant: AssetVariant) =>
      variant._id === variantId);
    if (selectedVariant !== this.selectedVariant) {
      this.selectedVariant = selectedVariant;
      if (!fillDefaults) {
        this.selectedChannel = null;
      } else {
        if (selectedVariant && selectedVariant.channels.length) {
          this.selectedChannel = selectedVariant.channels[0];
        }
      }
    }
  }

  @action.bound setChannel(receivedChannel: QCChannel): void {

    const selectedChannel = this.selectedVariant.channels.find((channel) => channel._id === receivedChannel._id);
    if (selectedChannel) {
      this.selectedChannel = observable(selectedChannel);
    } else {
      console.log('fix this bug');
    }
  }

  @action selectChannelByName(name: string): void {
    if (!this.selectedAssetType || !this.selectedVariant) {
      return;
    }
    const selectedChannel: QCChannel = this.selectedVariant.channels.find((channel: QCChannel) =>
      channel.name === name);
    if (selectedChannel) {
      this.selectedChannel = selectedChannel;
    }
  }

  @action setInstanceName(name: string): void {
    this.instanceName = name;
  }

  @action.bound clearSelections(): void {
    this.selectedAssetType = null;
    this.selectedVariant = null;
    this.selectedChannel = null;
    this.instanceName = '';
  }

  @action toggleAllUpdated(): void {
    this.allUpdated = !this.allUpdated;
  }

  @action.bound createAssetType(name: string): Promise<any> {
    return apiRequest(APIS.CREATE_ASSET_TYPE, {new_asset_type: {kind: 'qc', name}});
  }

  @action createAssetTypeVariantAndPipeline(name: string, variantId: string, pipelineName: string) {
    let newAssetType;
    const param = { a: name };
    return this.createAssetType(name)
      .then(async (apiResult) => {
        if (apiResult.error) {
          this.appState.toastStore.addToast({
            duration: 5000,
            message: this.locale.getFormattedString('settings.errorMessage.assetTypeAlreadyExist', param),
            severity: 'error',
          });
          return 'error';
        } else {
          newAssetType = await this.fetchAssetTypesToAddNew(name);
          return this.createVariant(newAssetType, variantId);
        }

      })
      .then((res) => {
        if (res === 'error') {
          return res;
        } else {
          return this.createPipeline(newAssetType, pipelineName, variantId);
        }
      });
  }

  @action createVariant(selectedType: AssetType, variantId: string): Promise<any> {
    return apiRequest(APIS.ADD_VARIANTS_TO_TYPE, {
      asset_type_id: selectedType._id,
      new_variants: [{_id: variantId, channels: []}],
    }).then((apiResult: any) => {
      if (apiResult.error) {
        const param = { a: variantId };
        this.appState.toastStore.addToast({
          duration: 5000,
          message: this.locale.getFormattedString('settings.errorMessage.assetVariantAlreadyExist', param),
          severity: 'error',
        });
        return 'error';
      }
      return;
    });
  }

  createNewVariant(variantId: string): Promise<void> {

    return apiRequest(APIS.ADD_VARIANTS_TO_TYPE, {
      asset_type_id: this.selectedAssetType._id,
      new_variants: [{_id: variantId, channels: []}],
    }).then((res) => {
      console.log('res', res);
      if (res && res.ok){
        this.fetchAssetTypes();
      }
    });
  }

  @action createPipeline(selectedType: AssetType, channelName: string, variantId: string): Promise<any> {
    return apiRequest(APIS.ADD_CHANNEL, {
      asset_type_id: selectedType._id,
      channel: {name: channelName},
      variant_id: variantId,
    }).then((apiResult: any) => {
      if (apiResult.error) {
        const param = { a: channelName };
        this.appState.toastStore.addToast({
          duration: 5000,
          message: this.locale.getFormattedString('settings.errorMessage.assetPipelineAlreadyExist', param),
          severity: 'error',
        });
        return 'error';
      } else {
        this.fetchAssetTypesToAddNew(selectedType.name)
          .then((assetTypeFromDB) => {
            this.selectedAssetType = observable(assetTypeFromDB);
            const variant: AssetVariant = assetTypeFromDB.variants[0];
            this.selectedVariant = observable(variant);
            this.selectedChannel = observable(variant.channels[0]);
            this.allUpdated = true;
          });
      }
      return;
    });
  }

  createNewChannel(channelName: string): Promise<void> {
    return apiRequest(APIS.ADD_CHANNEL, {
      asset_type_id: this.selectedAssetType._id,
      channel: {name: channelName},
      variant_id: this.selectedVariant._id,
    }).then((res) => {
      console.log('res', res);
      if (res && res.ok){
        this.fetchAssetTypes();
      }
    });
  }

  @computed get assetTypeNames(): string[] {
    return this.assetTypes.map((assetType: AssetType) => assetType.name).sort(this.compareAlphabetical);
  }

  @computed get variantIds(): string[] {
    if (!this.selectedAssetType || !this.selectedAssetType.variants ||
      !this.selectedAssetType.variants.length) {
      return [];
    }
    return this.selectedAssetType.variants.map((variant: AssetVariant) => variant._id)
      .sort(this.compareAlphabetical);
  }

  @computed get variantChannelNames(): NameAndDpp[] {
    if (!this.selectedVariant) {
      return [];
    }
    const newArr = this.selectedVariant.channels.map((channel: QCChannel) => {
      return {
        name: channel.name,
        dpp_id: channel.dpp_id,
        dpp_build_time: channel.dpp_build_time,
      };
    });

    return newArr.sort(this.compareAlphabeticalName);
  }

  @computed get allChannelNames(): string[] {
    const output: string[] = [];
    this.assetTypes.forEach((assetType: AssetType) => {
      assetType.variants.forEach((variant: AssetVariant) => {
        variant.channels.forEach((channel: QCChannel) => {
          output.push(channel.name);
        });
      });
    });
    return output.sort(this.compareAlphabetical);
  }

  @computed get availableChannels(): QCChannel[] {
    if (!this.selectedAssetType) {
      return [];
    }
    if (this.selectedVariant) {
      return this.selectedVariant.channels;
    }
    return this.selectedAssetType.variants.reduce((output: QCChannel[], variant: AssetVariant) => {
      return _.concat(output, variant.channels);
    }, []);
  }

  @computed get ready(): boolean {
    return !!this.selectedAssetType && !!this.selectedVariant && !!this.selectedChannel;
  }

  @computed get flatChannelList(): { assetType: string, variant: string, channel: string }[] {
    const output: { assetType: string, variant: string, channel: string }[] = [];
    this.assetTypes.forEach((assetType: AssetType) => {
      _.forEach(assetType.variants, (variant: AssetVariant) => {
        if (variant.channels && variant.channels.length) {
          _.forEach(variant.channels, (channel: QCChannel) => {
            output.push({assetType: assetType._id, variant: variant._id, channel: channel._id});
          });
        }
      });
    });
    return output;
  }

  compareAlphabetical(a: string, b: string): number {
    return a.localeCompare(b, 'en', {sensitivity: 'base'});
  }

  compareAlphabeticalName(a: NameAndDpp, b: NameAndDpp): number {
    return a.name.localeCompare(b.name, 'en', {sensitivity: 'base'});
  }
}
