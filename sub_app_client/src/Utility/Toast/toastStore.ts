import LocaleStore from '@otosense/locale';
import { action, computed, IObservableArray, makeObservable, observable /* makeAutoObservable */ } from 'mobx';
// CRF-minor | SH | 2021-06-04
// We should consider importing this from a shared library

interface Action {
  children: string;
  onClick: () => void;
}

export interface IToast {
  // text: any;
  action?: any | Action | string | JSX.Element;
  // className?: string;
  duration: number;
  severity: string;
  message: string;
  // autohide?: boolean;
  // disableAutohide?: boolean;
  // messagePriority?: string;
}

export interface ISnackbarProps {
  autohide?: boolean;
  // className: string;
  onDismiss: () => void;
  toasts: IToast[];
}

export default class ToastStore {
  // @observable toasts: IObservableArray<IToast> = observable.array([]);
  @observable baseClassName: string = 'oto-toast';
  @observable expandClassName: string = 'oto-toast--expand';
  @observable isExpanded: boolean = false;
  locale: LocaleStore;
  // @observable messageAdded: boolean = false;
  @observable openToast: boolean = false;
  @observable toast: IToast = {
      message: '',
      severity: 'info',
      duration: 0,
  };
  constructor(localeStore: LocaleStore) {
      makeObservable(this);
      this.locale = localeStore;
  }

  @action.bound setOpenToast(state: boolean): void {
      this.openToast = state;
  }

  @action.bound toggleExpand() {
      this.isExpanded = !this.isExpanded;
  }
  // @action.bound toggleMessageAdded(): void {
  //     this.messageAdded = !this.messageAdded;
  // }
  @action.bound addToast(toast: IToast): void {
      // toast.action = this.addExpandAction(toast.action)
      // if (toast !== this.toasts[0]) {
      //     const toastArr = [toast];
      //     this.toasts.replace(toastArr);
      // }
      this.toast = observable(toast);
      this.setOpenToast(true);
  }
  // @action.bound addToastRecording(toast: IToast): void {
  //     this.toasts.replace([toast]);
  //     this.messageAdded = true;
  // }
  @action.bound addToastSuccessRecording(text: string) {
      const toast = {
          duration: 5000,
          severity:  'success',
          message: text,
      };
      this.toast = observable(toast);
      // this.toasts.replace([toast]);
      // this.messageAdded = true;
      this.setOpenToast(true);
  }
  @action.bound addToastInfoRecording(text: string) {
      const toast = {
          duration: 5000,
          severity: 'info',
          message: text,
      };
      this.toast = observable(toast);
      this.setOpenToast(true);
      // this.toasts.replace([toast]);
      // this.messageAdded = true;
  }

}
