import { action, computed, makeObservable, observable } from 'mobx';
import { ReviewSessionsStore } from '../../Views/ReviewSessions';

const PROGRESS_INTERVAL: number = 100;

// CRF-minor | SH | 2021-06-04
// We should consider importing this from a shared library

export default class PlaybackStore {
  @observable playing: boolean = false;
  @observable progressMs: number = 0;
  @observable playbackIndex: number = 0;

  _audio: HTMLAudioElement;
  _playbackStart: number;
  _playing: Promise<any>;
  reviewSessionStore: ReviewSessionsStore;
  _scrolling: number;
  sensorDataBase64: string[];

  constructor(reviewSessionStore: ReviewSessionsStore) {
    makeObservable(this);
    this.reviewSessionStore = reviewSessionStore;
    this.playbackIndex = 0;
  }

  // @action.bound setSensorData(sensorDataBase64: string[]): void {
  //   this.handlePlaybackEnded();
  //   this.sensorDataBase64 = sensorDataBase64;
  //   this.playbackIndex = 0;
  // }

  @action.bound togglePlayback(): void {
    if (this.playing) {
      this.pausePlayback();
    } else {
      // this.progressMs = 0;
      this.playSession(0);
    }
  }

  @action.bound nextPlayback(): void {
    if (this.sensorDataBase64 && this.playbackIndex < this.sensorDataBase64.length - 1) {
      if (this.playing) {
        this.forceStopPlayback();
      }
      this.playbackIndex++;
    }
  }

  @action.bound prevPlayback(): void {
    if (this.playbackIndex > 0) {
      if (this.playing) {
        this.forceStopPlayback();
      }
      this.playbackIndex--;
    }
  }

  @action playSession(bt): Promise<void> {
    if (this._audio && this._audio.paused) {
      this._audio.play();
      this.playing = true;
    } else {
      const { loading } = this.reviewSessionStore;
      const playbackStart: number = performance.now();
      this._playbackStart = playbackStart;
      const ready: Promise<void> = this.playing || loading ? this.stopPlayback() : Promise.resolve();
      return ready.then(() => {
        const base64WavFile: string = this.sensorDataBase64[this.playbackIndex];

        if (!base64WavFile || this._playbackStart !== playbackStart) {
          return null;
        }

        this.playing = true;

        this._audio = new Audio('data:audio/wav;base64,' + base64WavFile);
        this._audio.onplaying = () => this.handlePlaybackStarted(bt);
        this._audio.onended = this.handlePlaybackEnded;
        this._audio.onpause = this.handlePlaybackPaused;
        this._audio.onerror = this.handlePlaybackError;
        this._playing = this._audio.play().catch(this.handlePlaybackError);

      });
    }

  }

  @action.bound forceStopPlayback(): Promise<void> {
    this._playbackStart = 0;
    if (this._audio) {
      this._audio.src = '';
    }
    return Promise.resolve(this.handlePlaybackEnded());
  }

  @action.bound pausePlayback(): void {
    this._audio.pause();
    this.playing = false;
  }

  @action.bound stopPlayback(): Promise<void> {
    if (this._audio) {
      this._audio.src = '';
    }
    return Promise.resolve(this.handlePlaybackEnded());
  }

  @action.bound handlePlaybackPaused(): void {
    // this.playing = false;
    this.stopIndicator();
    // this._audio.pause()
    // this._audio = null;
  }
  @action.bound handlePlaybackEnded(): void {
    this.playing = false;
    this.stopIndicator();
    this._audio = null;
    this.progressMs = 0;
  }

  @action.bound stopIndicator(): void {
    window.clearInterval(this._scrolling);
    this._scrolling = null;
  }

  @action.bound handlePlaybackStarted(bt?: number): void {
    this.scrollIndicator(bt);
  }

  @action.bound scrollIndicator(bt?: number): void {
    if (bt) {
      this.progressMs = bt / 1000;
    }
    let now: number = performance.now();
    const scroll: VoidFunction = () => {
      const newNow: number = performance.now();
      const delta: number = newNow - now;
      this.progressMs += delta;
      now = newNow;
    };
    if (this._scrolling) {
      this.stopIndicator();
    }
    this._scrolling = window.setInterval(scroll, PROGRESS_INTERVAL);
  }

  @action.bound handlePlaybackError(e: any): void {
    this.stopPlayback();
  }

  @computed get progressRatio(): number {
    const sessionDurationMs = (this._audio) ? this._audio.duration * 1000 : 1;
    return this.progressMs / (sessionDurationMs);
  }

  @action.bound downloadParameters() {
    return {
      download: `${this.playbackIndex}.wav`,
      href: 'data:audio/wav;base64,' + this.sensorDataBase64[this.playbackIndex],
    };
  }
}
