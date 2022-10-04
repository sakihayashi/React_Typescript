import React from 'react';

import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { Stack, Typography } from '@mui/material';

import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';

import ADI_logo from '../../../assets/ADI_logo.svg';
import { HeaderLeft, HeaderLogoBox, HeaderText } from './headerStyles';

const HeaderLogo = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;

  return (
    <HeaderLeft>
      <Stack direction="row" sx={{alignItems: 'baseline'}}>
        <HeaderLogoBox
          src={ADI_logo}
          alt="Analog Devices logo"
          title={appState.version + ''}
        />
        <Typography variant="h2" sx={{color: '#fff', marginLeft: 0.5, fontFamily: 'IBMPlexSans-Medium'}}>AI-Driven Acoustics Analysis</Typography>
      </Stack>

      <HeaderText variant="subtitle1">
        {locale.getString('general.version')}: {appState.version}
      </HeaderText>
    </HeaderLeft>
  );
};

export default observer(HeaderLogo);
