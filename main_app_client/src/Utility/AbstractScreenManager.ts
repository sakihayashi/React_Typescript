import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';

import { IInputs, TestingViews } from '../api';
import AppState from '../appState';
import { isSnakeCase, replaceAll } from './helper';

/**
 * A method decorator to ensure only one screen change is processed at a time, ignoring all other change requests.
 */
export const screenChangeLock = (
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
  const method = propertyDescriptor.value;

  propertyDescriptor.value = function(...args: any[]) {
    if (this.screenIsChanging === true) {
      console.log('screenChangeLock skipping propertyName:', propertyName);
      return;
    } else {
      console.log('screenChangeLock running propertyName:', propertyName);
      this.screenIsChanging = true;
      this.appState.isLoading = true;
    }
    return method.apply(this, args)
      .then(action((result) => {
        this.screenIsChanging = false;
        this.appState.isLoading = false;
        return result;
      }));
  };
  return propertyDescriptor;
};

/**
 * A method decorator to enable queueing up screen changes in cases where a screen should be skipped.
 * Trigger by setting ScreenManager.queueScreenChange=true within the implementation of ScreenManager.onScreenChange()
 */
export const queueScreenChange = (
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
  const method = propertyDescriptor.value;

  propertyDescriptor.value = function(...args: any[]) {
    return new Promise((resolve) => {
      const loop: VoidFunction = action(() => {
        this.queueScreenChange = false;
        method.apply(this, args)
          .then(action((result: any) => {
            if (this.queueScreenChange) {
              setTimeout(loop, 1);
            } else {
              resolve(result);
            }
          }));
      });
      loop();
    });
  };
  return propertyDescriptor;
};

/**
 * A method decorator to clear screenErrorMessage at the beginning of the method call.
 */
export const clearScreenErrorMessage = (
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
  const method = propertyDescriptor.value;

  propertyDescriptor.value = function(...args: any[]) {
    this.screenErrorMessage = null;
    return method.apply(this, args);
  };
  return propertyDescriptor;
};

export interface IScreenManager {
  appState: AppState;
  inputs: Partial<IInputs>;
  screenErrorMessage: string;
  screen: TestingViews;
  screenIndex: number;
  screenIsChanging: boolean;
  nextButtonLabel: string;
  prevButtonLabel: string;
  queueScreenChange: boolean;
  currentTitle: string;

  onScreenChange(nextScreen: TestingViews): Promise<void>;

  lastNextScreen(): void;

  lastNextLabel(): string;

  firstBackLabel(): string;

  resetInheritingClass(): Promise<void>;

  reset(): Promise<void>;

  nextScreen(): Promise<any>;

  prevScreen(): Promise<any>;

  setScreenErrorMessage(message: string): void;
}

export default abstract class AbstractScreenManager implements IScreenManager {
  screenOrder: TestingViews[] = [
    TestingViews.ASSET_SELECTION,
    TestingViews.RECORD_AND_TEST,
  ];
  @observable appState: AppState;
  @observable screenIndex: number = 0;
  @observable inputs: Partial<IInputs> = {};
  @observable screenIsChanging: boolean = false;
  @observable queueScreenChange: boolean = false;
  @observable screenErrorMessage: string;

  protected constructor(appState: AppState, screenOrder: TestingViews[]) {
    this.appState = appState;
    this.screenOrder = screenOrder;
    this.reset();
  }

  abstract onScreenChange(nextScreen: TestingViews): Promise<void>;

  abstract lastNextScreen(): void;

  abstract lastNextLabel(): string;

  abstract firstBackLabel(): string;

  abstract resetInheritingClass(): Promise<void>;

  @action setScreenIndex(screenIndex: number): void {
    this.screenIndex = screenIndex;
  }

  @action.bound reset(): Promise<void> {
    this.inputs = {};
    this.screenErrorMessage = null;
    return this.resetInheritingClass()
      .then(() => {
        // if (this.screenOrder[0] === TestingViews.ASSET_SELECTION) {
        //     return this._nextInputFieldChoices();
        // }
        return Promise.resolve();
      }).then(() => this.setScreenIndex(0));
  }

  @computed get screen(): TestingViews {
    return this.screenOrder[this.screenIndex];
  }

  set screen(screen: TestingViews) {
    const index = this.screenOrder.indexOf(screen);
    if (index === -1) {
      throw Error(`Invalid screen does not exist in screen order: ${screen}`);
    }
    this.setScreenIndex(index);
  }

  @action.bound @screenChangeLock @queueScreenChange @clearScreenErrorMessage nextScreen(): Promise<any> {
    const nextIndex: number = this.screenIndex + 1;
    if (nextIndex >= this.screenOrder.length) {
      return Promise.resolve(this.lastNextScreen());
    }
    const nextScreen: TestingViews = this.screenOrder[nextIndex];
    // if (nextScreen === TestingViews.ASSET_SELECTION) {
    //     await this._nextInputFieldChoices();
    // }

    return this.onScreenChange(nextScreen)
      .then(() => this.screen = nextScreen);
  }

  @screenChangeLock @queueScreenChange @clearScreenErrorMessage prevScreen(): Promise<any> {
    const revert: Promise<void> = Promise.resolve();
    const prevScreen: TestingViews = this.screenOrder[this.screenIndex - 1];
    // if (prevScreen === TestingViews.ASSET_SELECTION) {
    //     let inputs: Partial<IInputs>;
    //     try {
    //         inputs = this.inputScreenHistory.pop().inputs;
    //     } catch {
    //         inputs = {};
    //     }
    //     revert = this._revertInputField(inputs);
    // }
    return revert.then(() => this.onScreenChange(prevScreen)
      .then(() => this.screen = prevScreen));
  }

  @computed get isFirstScreen(): boolean {
    return (this.screenIndex === 0
      && (this.screen !== TestingViews.ASSET_SELECTION/* || this.isFirstInputFieldChoices*/));
  }

  @computed get isLastScreen(): boolean {
    return (this.screenIndex + 1 === this.screenOrder.length);
  }

  @computed get nextButtonLabel(): string {
    if (this.isLastScreen) {
      return this.lastNextLabel();
    }
    return this.appState.locale.getString('util.next');
  }

  @computed get prevButtonLabel(): string {
    if (this.isFirstScreen) {
      return this.firstBackLabel();
    }
    return this.appState.locale.getString('util.back');
  }

  get currentTitle(): string {
    let title: string = this.screen;
    // if (this.screen === TestingViews.ASSET_SELECTION
    //     && this.currentInputFieldChoices && this.currentInputFieldChoices.field) {
    //     title =  this.currentInputFieldChoices.field.split('.')[0];
    // } else {
    //     title = this.screen;
    // }
    title = this.appState.getTitle(title);
    if (title != null && isSnakeCase(title)) {
      title = replaceAll(title, '_', ' ').toLowerCase();
    }
    return title;
  }

  @computed get hasScreenErrorMessage(): boolean {
    return this.screenErrorMessage != null;
  }

  @action.bound setScreenErrorMessage(message: string): void {
    this.appState.toastStore.addToast({
      action: {
        children: this.appState.locale.getString('util.exit'),
        onClick: this.reset,
      },
      duration: 5000,
      severity: 'error',
      message,
    });
    this.screenErrorMessage = message;
  }
}
