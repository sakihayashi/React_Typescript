import {Header} from '@otosense/components';
import LocaleStore from '@otosense/locale';
import {observer} from 'mobx-react-lite';
import * as React from 'react';
import {useRootContext} from '../../App';
import AppState from '../../appState';
import HeaderLang from './HeaderLang';
import HeaderLogo from './HeaderLogo';
import {HeaderRight, HeaderText} from './headerStyles';
import HeaderUserMenu from './HeaderUserMenu';

const HeaderWrapper = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;

  return (
    <Header>
      <React.Fragment>
        <HeaderLogo/>
        <HeaderRight>
          <HeaderLang/>
          <HeaderText onClick={() => appState.toggleDateTimeFormat()}>
            {appState.currentDateTime}
          </HeaderText>
          <HeaderUserMenu
            logout={appState.logout}
            textLogout={locale.getString('global.logout')}
            setCurrentTimestamp={appState.setCurrentTimestamp}
            account={appState.account}
          />
        </HeaderRight>
      </React.Fragment>
    </Header>
  );
};

export default (observer(HeaderWrapper));
