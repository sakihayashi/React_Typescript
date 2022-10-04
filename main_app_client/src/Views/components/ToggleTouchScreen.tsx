import React from 'react';

import { Tooltip, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { FlexBox, OtoSwitch, TextIconBox } from '@otosense/components';
import InfoIcon from '@mui/icons-material/Info';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';

const ToggleTouchScreenMode = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  return (
    <TextIconBox>
      <Tooltip title={locale.getString('general.touchScreen')} placement="bottom"  arrow>
        <FlexBox sx={{cursor: 'pointer'}}>
          <Typography variant="subtitle1" mr={0.3}>{locale.getString('global.touchScreenMode')}</Typography>
          <InfoIcon sx={{color: 'secondary.contrastText', marginRight: 0.3}}/>
        </FlexBox>
      </Tooltip>
      <OtoSwitch value={appState.touchScreenMode} onChange={appState.toggleTouchScreenMode}/>
    </TextIconBox>
  );
};

export default observer(ToggleTouchScreenMode);