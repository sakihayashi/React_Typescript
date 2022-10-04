import * as _ from 'lodash';
import {action, computed, IObservableArray, makeObservable, observable, when} from 'mobx';

import apiRequest, {APIS} from './api';
import AppState from './appState';

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

  [fieldName: string]: any;
}

export interface DeviceChannel {
  // sensor?: string;
  channel_name?: string;
  channel_id?: string;
  iepe?: boolean;
  coupling?: string;
  mode?: string;
  range?: string;
}

export interface DeviceConfig {
  sample_rate?: number | string;
  device_channels?: DeviceChannel[];
  buffer_name: string;
  sensor?: string;
  continuous: boolean;
}

export default class AssetTypeStore {
  @observable assetTypes: IObservableArray<AssetType> = observable.array([]);
  @observable instanceName: string = '';
  @observable selectedAssetType: AssetType = null;
  @observable selectedChannel: QCChannel = null;
  @observable selectedVariant: AssetVariant = null;

  appState: AppState;

  constructor(appState: AppState) {
    this.appState = appState;
    makeObservable(this);
    window['assetTypeStore'] = this;
    when(() => appState.configIsSet, this.fetchAssetTypes);
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

  @action.bound fetchAssetTypes() {
    return apiRequest(APIS.LIST_ASSET_TYPE, {})
    .then(this.receiveAssetTypes);
  }

  @action.bound selectAssetTypeByName(assetTypeName: any, fillDefaults?: boolean): void {
    const selectedAssetType: AssetType = this.assetTypes.find((assetType: AssetType) =>
      assetType.name === assetTypeName);
    if (selectedAssetType !== this.selectedAssetType) {
      this.selectedAssetType = selectedAssetType || null;
      if (!fillDefaults) {
        this.selectedVariant = null;
        this.selectedChannel = null;
      } else {
        if (selectedAssetType && selectedAssetType.variants.length) {
          const variant: AssetVariant = selectedAssetType.variants[0];
          this.selectedVariant = variant;
          if (variant.channels.length) {
            this.selectedChannel = variant.channels[0];
          }
        }
      }
    }
  }

  @action.bound selectAssetTypeById(id: string): void {
    const selectedAssetType: AssetType = this.assetTypes.find((assetType: AssetType) =>
      assetType._id === id);
    if (selectedAssetType !== this.selectedAssetType) {
      this.selectedAssetType = selectedAssetType || null;
      this.selectedVariant = null;
      this.selectedChannel = null;
    }
  }

  @action.bound selectVariant(variant: AssetVariant): void {
    this.selectedVariant = variant;
    this.selectedChannel = null;
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
      this.selectedVariant = selectedVariant || null;
      if (!fillDefaults) {
        this.selectedChannel = null;
      } else {
        if (selectedVariant && selectedVariant.channels.length) {
          this.selectedChannel = selectedVariant.channels[0];
        }
      }
    }
  }

  @action selectChannel(channel: QCChannel): void {
    this.selectedChannel = channel;
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

  @action clearSelections(): void {
    this.selectedAssetType = null;
    this.selectedVariant = null;
    this.selectedChannel = null;
    this.instanceName = '';
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

  @computed get variantChannelNames(): string[] {
    if (!this.selectedVariant) {
      return [];
    }
    return this.selectedVariant.channels.map((channel: QCChannel) => channel.name).sort(this.compareAlphabetical);
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
    return this.selectedAssetType.variants.reduce((output: QCChannel[], variant: AssetVariant) => _.concat(output, variant.channels), []);
  }

  @computed get ready(): boolean {
    return !!this.selectedAssetType && !!this.selectedVariant && !!this.selectedChannel;
  }

  @computed get flatChannelList(): Array<{ assetType: string; variant: string; channel: string }> {
    const output: Array<{ assetType: string; variant: string; channel: string }> = [];
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
}
