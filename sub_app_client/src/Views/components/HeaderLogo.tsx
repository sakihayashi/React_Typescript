
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRootContext } from '../../App';
import AppState from '../../appState';
import ADI_logo from '../../assets/OtoSense_logo.svg';
import { HeaderLeft, HeaderLogoBox, HeaderText } from './headerStyles';

const HeaderLogo = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;

  return(
    <HeaderLeft>
      <HeaderLogoBox src={ADI_logo} alt="Analog Devices logo" title={appState.version + ''}/>
      <HeaderText>{locale.getString('general.version')}: {appState.version}</HeaderText>
    </HeaderLeft>
  );
};

export default (observer(HeaderLogo));
