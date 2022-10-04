import LocaleStore from '@otosense/locale';
import * as _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRootContext } from './App';
import { View } from './appState';
import Toast from './Utility/Toast/Toast';
import * as ViewScreens from './Views';
import HeaderWrapper from './Views/components/HeaderWrapper';
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const Main = () => {
  const root = useRootContext();
  const appState = root.appState;
  const locale: LocaleStore = appState.locale;
  let content: JSX.Element;
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      e.returnValue = locale.getString('general.refreshAlert'); // Legacy method for cross browser support
    }
    return true;
  };

  switch (appState.view) {
    case View.WIZARD_MAIN:
        content = <ViewScreens.DppWizardMain />;
        break;
    case View.DPP_LIST:
    default:
        content = <ViewScreens.DppList />;
        break;
  }

  return (
    <div className="oto-main">
      <HeaderWrapper />
      <div className="oto-main__block">{content}</div>
      {appState.isLoading && (
        <div className="oto-loading oto-loading__screen">
          <div className="oto-loading__loader">
            {locale.getString('global.loadingMessage')}
          </div>
        </div>
      )}
      <Toast />
    </div>
  );
};

export default observer(Main);
