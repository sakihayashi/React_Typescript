import React from 'react';

import { Box, FormControl, Grid, MenuItem, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import SettingsStore from '../../settingsStore';

import { FlexBox } from '../../globalStyles/otoBox';

const ButtonConfig = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  const options = [
    `${locale.getString('settings.button1')} ( ${locale.getString(
      'settings.red'
    )} )`,
    `${locale.getString('settings.button2')} ( ${locale.getString(
      'settings.blue'
    )})`,
  ];
  const btnStartStop = [
    [
      locale.getString('settings.startButton'),
      locale.getString('settings.buttonState'),
    ],
    [
      locale.getString('settings.stopButton'),
      locale.getString('settings.buttonState'),
    ],
  ];
  const btnStates = [
    locale.getString('settings.pressed'),
    locale.getString('settings.hold'),
    locale.getString('settings.released'),
  ];
  const settingFunctions = [
    settingsStore.setStartBtn,
    settingsStore.setStopBtn,
  ];
  const currentBtnStates = [settingsStore.startBtn, settingsStore.stopBtn];

  return (
    <Grid container sx={{ width: 750 }}>
      <Grid xs={6} item={true}>
        <Typography variant="h3" component="h3" mb={1}>
          {locale.getString('settings.buttonsDelcom')}
        </Typography>
        <Typography variant="body1" component="p" mb={0.5}>
          {locale.getString('settings.button1')}:{' '}
          <b>{locale.getString('settings.red')}</b>
        </Typography>
        <Typography variant="body1" component="p">
          {locale.getString('settings.button2')}:{' '}
          <b>{locale.getString('settings.blue')}</b>
        </Typography>
      </Grid>
      <Grid xs={6} item={true}>
        <Typography variant="h3" component="h3" mb={1}>
          {locale.getString('settings.startAndStopSession')}
        </Typography>
        <Box>
          {btnStartStop.map((btn, index) => {
            return (
              <FlexBox
                key={btn[index] + index}
                mb={1}
                justifyContent="space-between"
              >
                <FormControl size="small" sx={{ marginRight: 1 }}>
                  <Typography variant="overline" id={`${btn[0]}-${index}`}>
                    {btn[0]}
                  </Typography>
                  <Select
                    labelId={`${btn[0]}-${index}`}
                    value={currentBtnStates[index][0]}
                    placeholder={currentBtnStates[index][0]}
                    name={btn[0]}
                    onChange={(e: SelectChangeEvent) =>
                      settingFunctions[index](e.target.value, 0)
                    }
                    sx={{ background: 'background.paper' }}
                  >
                    {options &&
                      options.map((item, i) => {
                        return (
                          <MenuItem key={`${item}-${i}`} value={item}>
                            {item}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <Typography variant="overline">{btn[1]}</Typography>
                  <Select
                    value={currentBtnStates[index][1]}
                    name={btn[1]}
                    onChange={(e: SelectChangeEvent) =>
                      settingFunctions[index](e.target.value, 1)
                    }
                    sx={{
                      textTransform: 'none',
                      '::first-letter': {
                        textTransform: 'uppercase',
                      },
                      background: 'background.paper',
                    }}
                  >
                    {btnStates.map((state, i) => {
                      return (
                        <MenuItem
                          sx={{ textTransform: 'none', '::first-letter': {
                            textTransform: 'uppercase',
                          }}}
                          key={`${state}-${i}`}
                          value={state}
                        >
                          {state}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </FlexBox>
            );
          })}
        </Box>
      </Grid>
    </Grid>
  );
};

export default observer(ButtonConfig);
