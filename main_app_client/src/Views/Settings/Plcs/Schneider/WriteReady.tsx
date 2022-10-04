import React, { ChangeEvent, useEffect } from 'react';

import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../../../RootStore';
import AppState from '../../../../appState';
import SettingsStore from '../../../../settingsStore';

import {
  EventHandlerContainer,
  FlexCol,
  FlexRow,
  FormStyle,
  innerContainer,
  rowTitle,
  Subtitle,
} from './styles';
import { CenterBox } from '../../../../globalStyles/otoBox';

const WriteReady = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;

  const textFieldOnChange = (name: string, val: string | number) => {
    settingsStore.setPlcReadiness(name, val);
  };
  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    settingsStore.setPlcReadiness(e.target.name, e.target.checked);
  };

  useEffect(() => {
    if (!settingsStore.readiness.address){
      settingsStore.setDisabledNext(true);
    } else if (!!settingsStore.readiness.address) {
      settingsStore.setDisabledNext(false);
    }
  }, [settingsStore.readiness.address]);
  useEffect(() => {
    settingsStore.setPlcReadiness('trigger_value', settingsStore.trigger_value);
    settingsStore.setPlcReadiness('operation', '=');
  }, []);

  return (
    <EventHandlerContainer>
      <Typography variant="h3" component="header" sx={Subtitle}>
        {locale.getString('literals.ready')}
      </Typography>
      <Box sx={innerContainer}>
        <FlexRow>
          <Typography variant="h4" sx={rowTitle}>
            {locale.getString('settings.readiness')}
          </Typography>
          <FlexCol mr={1}>
            <Typography variant="overline">
              {locale.getString('literals.address')}
            </Typography>
            <TextField
              variant="filled"
              placeholder={locale.getString('settings.enterAddress')}
              sx={FormStyle}
              size="small"
              type="number"
              value={!!settingsStore.readiness.address ? settingsStore.readiness.address + '' : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ marginBottom: '16px' }}
                  >
                    %MW
                  </InputAdornment>
                ),
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (isNaN(+e.target.value)){
                  return;
                } else {
                  textFieldOnChange('address', +e.target.value);
                }
              }
              }
            />
          </FlexCol>
          <FlexCol mr={1}>
            <Typography variant="overline">
              {locale.getString('settings.operator')}
            </Typography>
            <CenterBox sx={{height: 45}}>
              <Typography variant="subtitle1">{locale.getString('literals.assign')}</Typography>
            </CenterBox>
          </FlexCol>
          <FlexCol>
            <Typography variant="overline">
              {locale.getString('literals.value')}
            </Typography>
            <TextField
              variant="filled"
              sx={FormStyle}
              placeholder="0x0001"
              type="number"
              value={settingsStore.readiness.value && settingsStore.readiness.value + ''}
              size="small"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (isNaN(+e.target.value)){
                  return;
                } else {textFieldOnChange('value', +e.target.value);}
              }}
            />
          </FlexCol>
        </FlexRow>
      </Box>
      <FlexRow>
        <FormGroup sx={{ marginLeft: 1 }}>
          <FormControlLabel
            control={<Checkbox onChange={handleCheckBox} name="reset_on_session_start"/>}
            checked={settingsStore.readiness.reset_on_session_start}
            label={locale.getString('settings.resetValuesEnd')}
          />
        </FormGroup>
      </FlexRow>
    </EventHandlerContainer>
  );
};

export default observer(WriteReady);
