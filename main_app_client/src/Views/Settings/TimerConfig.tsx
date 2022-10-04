import React, { ChangeEvent, useEffect } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import { TextField, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import SettingsStore from '../../settingsStore';

import { InfoIconStyle, TimerBox, UnitBoxEventConfig } from './styles';
import { FlexBox, FormBox } from '../../globalStyles/otoBox';

const TimerConfig = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  const values = [
    settingsStore.duration,
    settingsStore.interval,
    settingsStore.maxSessions,
  ];
  const headers = [
    locale.getString('settings.duration'),
    locale.getString('settings.interval'),
    locale.getString('settings.maxSessions'),
  ];
  useEffect(() => {
    if (!values[0]){
      settingsStore.setSaveBtnDisabled(true);
    } else if (!!values[0] || !!values[1] || !!values[2]) {
      settingsStore.setSaveBtnDisabled(false);
    } else if (!values[2] && values[2] !== 0){
      settingsStore.setSaveBtnDisabled(true);
    } else if (!values[1] && values[1] !== 0){
      settingsStore.setSaveBtnDisabled(true);
    }
  }, [values[0], values[1], values[2]]);
  return (
    <TimerBox sx={{ width: 650 }}>
      {headers.map((header, index) => {
        let unitLabel: string;
        let error: boolean;
        if (index < 2) {
          unitLabel = locale.getString('settings.seconds');
        } else {
          unitLabel = locale.getString('settings.sessions');
        }
        if (index < 1){
          error = !values[index];
        } else {
          error = !values[index] && values[index] !== 0;
        }

        return (
          <FlexBox
            mb={2}
            mr={4}
            sx={{ flex: '1' }}
            key={`timer-config-setting-${header}-${index}`}
          >
            <FormBox>
              <Typography variant="overline">{header}</Typography>
              <FlexBox>
                <TextField
                  type="number"
                  size="small"
                  sx={{ width: 250 }}
                  value={!!values[index] || values[index] === 0 ? values[index] + '' : ''}
                  error={error}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    settingsStore.setTimerValues(e, index)
                  }
                />
                <UnitBoxEventConfig>
                  <Typography variant="body1">{unitLabel}</Typography>
                </UnitBoxEventConfig>
              </FlexBox>
              {header === locale.getString('settings.maxSessions') && (
                <FlexBox>
                  <InfoIcon sx={InfoIconStyle} />
                  <Typography variant="caption">
                    {locale.getString('settings.0IsUnlimited')}
                  </Typography>
                </FlexBox>
              )}
            </FormBox>
          </FlexBox>
        );
      })}
    </TimerBox>
  );
};

export default observer(TimerConfig);
