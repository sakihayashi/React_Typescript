import LocaleStore from '@otosense/locale';
import { HtmlAudioModule } from '@otosense/sound-utils';

import { action, computed, makeObservable, observable } from "mobx";
import AppState from "./appState";
import AssetTypeStore from "./assetTypeStore";
import ToastStore from "./Utility/Toast/toastStore";
// import { ReviewSessionsStore } from './Views/ReviewSessions';
import { DppWizardStore } from "./Views/Wizard";

import { availableLocales } from './Utility/constants';
import { DppListStore } from './Views/DppList';
import DppSessionsStore from './Views/Wizard/sessionStore';

const localeStore = new LocaleStore({ supportedLocales: availableLocales });
window['localeStore'] = localeStore;
const toastStore = new ToastStore(localeStore);
const appState = new AppState(localeStore, toastStore);
const assetTypeStore = new AssetTypeStore(appState);
// const reviewSessionsStore = new ReviewSessionsStore(appState);
const dppSessionStore = new DppSessionsStore(appState);
const dppWizardStore = new DppWizardStore(appState, localeStore,  assetTypeStore, dppSessionStore);
const playbackStore = new HtmlAudioModule({ isLoading: () => dppSessionStore.loading });
const dppListStore = new DppListStore();
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

const rootStore = {
    appState,
    assetTypeStore,
    dppListStore,
    dppWizardStore,
    localeStore,
    playbackStore,
    // reviewSessionsStore,
    toastStore,
    dppSessionStore,
};

export default rootStore;
