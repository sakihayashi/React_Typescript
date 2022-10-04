import React from 'react';
import LocaleStore from '@otosense/locale';
import { HtmlAudioModule } from '@otosense/sound-utils';
import { action, computed, makeObservable, observable } from 'mobx';
import AppState from './appState';
import AssetTypeStore from './assetTypeStore';
import SettingsStore from './settingsStore';
import { availableLocales } from './Utility/constants';
import ToastStore from './Utility/Toast/toastStore';
import DataCollectionStore from './Views/DataCollectionAndAnalysis/store';
import { ReviewSessionsStore } from './Views/ReviewSessions';

// const LOCALE_ROOT = process?.env?.LOCALE_ROOT_DIR || '/static/json/locales';
const LOCALE_ROOT = '/static/json/locales';
const localeStore = new LocaleStore({ rootDir: LOCALE_ROOT, supportedLocales: availableLocales });
window['localeStore'] = localeStore;
const toastStore = new ToastStore(localeStore);
const appState = new AppState(localeStore, toastStore);
const assetTypeStore = new AssetTypeStore(appState, localeStore);
const reviewSessionsStore = new ReviewSessionsStore(appState, assetTypeStore);
const settingsStore = new SettingsStore(appState, assetTypeStore);
const playbackStore = new HtmlAudioModule({isLoading: () => reviewSessionsStore.loading});
makeObservable(playbackStore, {
  forceStopPlayback: action,
  handlePlaybackEnded: action,
  nextPlayback: action,
  pausePlayback: action,
  playSession: action,
  playbackIndex: observable,
  playing: observable,
  prevPlayback: action,
  progressMs: observable,
  progressRatio: computed,
  scrollIndicator: action,
  setBase64Data: action,
  setPlaying: action,
  stopPlayback: action,
});
const dataCollectionStore = new DataCollectionStore(appState, reviewSessionsStore);
appState.dataCollectionStoreReset = dataCollectionStore.reset;

const rootStore = {
  appState,
  assetTypeStore,
  dataCollectionStore,
  localeStore,
  playbackStore,
  reviewSessionsStore,
  settingsStore,
  toastStore,
};

export const RootStoreContext = React.createContext<typeof rootStore>(null);
export const useRootContext = () => React.useContext(RootStoreContext);

export default rootStore;
