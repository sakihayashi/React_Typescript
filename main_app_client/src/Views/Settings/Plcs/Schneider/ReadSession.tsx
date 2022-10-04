import React, { ChangeEvent, useEffect, useState } from 'react';

import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { VirtualInputContainer } from '@otosense/components';
import { toJS } from 'mobx';

import { useRootContext } from '../../../../RootStore';
import AppState from '../../../../appState';
import SettingsStore from '../../../../settingsStore';
import { replaceToNumeric, validateInteger } from '../../../../Utility/helper';

import {
  EventHandlerContainer,
  FlexCol,
  FlexRow,
  FormSelectStyle,
  FormStyle,
  innerContainer,
  rowTitle,
  Subtitle,
} from './styles';
import { FormBox } from '../../../../globalStyles/otoBox';

const ReadSession = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;

  const operatorOpt = [
    locale.getString('settings.equalTo'),
    locale.getString('settings.moreThan'),
    locale.getString('settings.lessThan'),
    locale.getString('settings.notEqualTo'),
  ];
  const hiddenOperators: string[] = ['==', '>', '<', '<>'];
  const values = [
    settingsStore.sessionBt,
    settingsStore.sessionTt,
  ];
  const [operators, setOperators] = useState<string[]>([operatorOpt[hiddenOperators.indexOf(settingsStore.sessionBt.operation)] || '', operatorOpt[hiddenOperators.indexOf(settingsStore.sessionTt.operation)] || '']);
  const inputIndex = 0;

  const headers = [
    locale.getString('testing.start'),
    locale.getString('testing.stop'),
  ];
  const handleChanges = [
    settingsStore.setSessionBt,
    settingsStore.setSessionTt,
  ];

  const handleInterval = (val: number) => {
    const onlyNumeric = replaceToNumeric(val + '');
    settingsStore.setTriggerValue(+onlyNumeric);
  };

  useEffect(() => {
    if (
      !!settingsStore.sessionBt.address && !!settingsStore.sessionBt.operation && validateInteger(settingsStore.sessionBt.value + '') &&
      !!settingsStore.sessionTt.address && !!settingsStore.sessionTt.operation && validateInteger(settingsStore.sessionTt.value + '') && !!settingsStore.trigger_value){
      settingsStore.setDisabledNext(false);
    } else {
      settingsStore.setDisabledNext(true);
    }
  }, [settingsStore.sessionBt.address, settingsStore.sessionBt.operation, settingsStore.sessionBt.value, settingsStore.sessionTt.address, settingsStore.sessionTt.operation, settingsStore.sessionTt.value, settingsStore.trigger_value]);

  useEffect(() => {
    const arr: string[] = toJS(operators);
    values.forEach((data, i) => {
      if (data.operation){
        const index = hiddenOperators.indexOf(data.operation);
        arr[i] = operatorOpt[index];
        setOperators(arr);
      }
    });
  }, []);
  return (
    <EventHandlerContainer>
      <Typography variant="h3" sx={Subtitle}>
        {locale.getString('settings.sessionDetection')}
      </Typography>
      <Box sx={innerContainer}>
        {headers.map((header, i) => {
          return (
            <FlexRow
              key={`session-detection-${header}-${i}`}
              mb={i === 0 ? 1 : 0}
            >
              <Typography variant="h4" sx={rowTitle}>
                {header}
              </Typography>
              <FormBox mr={0.5}>
                {i === 0 &&
                <Typography variant="overline">
                  {locale.getString('literals.address')}
                </Typography>
                }
                <TextField
                  required
                  error={!values[i].address}
                  type="number"
                  placeholder={locale.getString('settings.enterAddress')}
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
                  value={values[i].address ? values[i].address : ''}
                  sx={FormStyle}
                  size="small"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (isNaN(+e.target.value)) {
                      return;
                    } else {
                      handleChanges[i]('address', +e.target.value);
                    }
                  }}
                  onBlur={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (isNaN(+e.target.value)) {
                      return;
                    } else {
                      handleChanges[i]('address', +e.target.value);
                    }
                  }
                  }
                />
              </FormBox>
              <FormBox mr={0.5}>
                {i === 0 &&
                <Typography variant="overline">
                  {locale.getString('settings.operator')}
                </Typography>
                }
                <FormControl variant="filled" size="xsmall">
                  <Select
                    error={!operators[i]}
                    value={operators[i] || ''}
                    sx={FormSelectStyle}
                    onChange={(e: SelectChangeEvent) => {
                      const index = operatorOpt.indexOf(e.target.value);
                      handleChanges[i]('operation', hiddenOperators[index]);
                      const arr = [...operators];
                      arr[i] = e.target.value;
                      setOperators(arr);
                    }
                    }
                  >
                    {operatorOpt.map((opt) => {
                      return (
                        <MenuItem
                          key={`session-detect-operator-${opt}`}
                          value={opt}
                        >
                          {opt}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </FormBox>
              <FlexCol>
                {i === 0 &&
                <Typography variant="overline">
                  {locale.getString('literals.value')}
                </Typography>
                }
                <TextField
                  required
                  size="small"
                  variant="filled"
                  sx={FormStyle}
                  value={values[i].value + ''}
                  placeholder="0x0001"
                  type="number"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (isNaN(+e.target.value)){
                      return;
                    } else {
                      handleChanges[i]('value', +e.target.value);
                    }
                  }}
                />
              </FlexCol>
            </FlexRow>
          );
        })}
      </Box>
      <div style={{ marginTop: 24 }} />
      <Box sx={innerContainer}>
        <FlexRow>
          <Typography variant="h4" sx={rowTitle}>
            {locale.getString('settings.pullInterval')}
          </Typography>
          <FlexCol>
            <Typography variant="overline">
              {locale.getString('settings.duration')}
            </Typography>
            <VirtualInputContainer
              touchScreenMode={appState.touchScreenMode}
              moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[inputIndex]}
              onClose={() => appState.resetMoveUpStyle(inputIndex)}
              text={locale.getString('literals.close')}
            >
              <TextField
                variant="filled"
                placeholder={locale.getString('settings.enterDuration')}
                size="small"
                type="number"
                error={!values[0].trigger_value}
                value={!!values[0].trigger_value ? values[0].trigger_value + '' : ''}
                sx={FormStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {locale.getString('settings.ms')}
                    </InputAdornment>
                  ),
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (isNaN(+e.target.value)){
                    return;
                  } else {
                    handleInterval(+e.target.value);
                  }
                }}
                onFocus={() => appState.setMoveUpStyle(inputIndex)}
                onBlur={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  if (isNaN(+e.target.value)){
                    return;
                  } else {
                    handleInterval(+e.target.value);
                  }
                }}
              />
            </VirtualInputContainer>
          </FlexCol>
        </FlexRow>
      </Box>
    </EventHandlerContainer>
  );
};

export default observer(ReadSession);
