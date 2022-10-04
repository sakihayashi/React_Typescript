import * as React from 'react';

import { Header2022 } from '@otosense/components';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';

import HeaderLang from './HeaderLang';
import HeaderLogo from './HeaderLogo';

import {
  HeaderRight,
  HeaderText,
} from './headerStyles';
import HeaderUserMenu from './HeaderUserMenu';

const HeaderWrapper = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;

  return (
    <Header2022>
      <>
        <HeaderLogo />
        <HeaderRight>
          <HeaderLang />
          <HeaderText variant="h3" onClick={() => appState.toggleDateTimeFormat()}>
            {appState.currentDateTime}
          </HeaderText>
          <HeaderUserMenu
            logout={appState.logout}
            textLogout={locale.getString('global.logout')}
            setCurrentTimestamp={appState.setCurrentTimestamp}
            account={appState.account}
          />
        </HeaderRight>
      </>
    </Header2022>
  );
};

export default observer(HeaderWrapper);
