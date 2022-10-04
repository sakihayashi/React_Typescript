import React, { ChangeEvent } from 'react';

import {
  Box,
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

const WriteLearningMode = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  const handleTextFields = (fieldName: string, val: string | number) => {
    settingsStore.setLearningMode(fieldName, val);
  };
  return (
    <EventHandlerContainer>
      <Typography variant="h3" sx={Subtitle}>
        {locale.getString('testing.dataAcquisitionOnly')}
      </Typography>
      <Box sx={innerContainer}>
        <FlexRow>
          <Typography variant="h4" sx={rowTitle}>
            {locale.getString('settings.variable')}
          </Typography>
          <FlexCol mr={0.5}>
            <Typography variant="overline">
              {locale.getString('literals.address')}
            </Typography>
            <TextField
              size="small"
              placeholder={locale.getString('settings.enterAddress')}
              sx={FormStyle}
              type="number"
              value={settingsStore.set_learning_mode.address ? settingsStore.set_learning_mode.address : ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleTextFields('address', +e.target.value)
              }
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
            />
          </FlexCol>
          <FlexCol mr={0.5}>
            <Typography variant="overline">
              {locale.getString('settings.operator')}
            </Typography>
            <Typography variant="subtitle1" sx={{height: 45, display: 'flex', alignItems: 'center'}}>{locale.getString('settings.equalTo')}</Typography>
          </FlexCol>
          <FlexCol>
            <Typography variant="overline">
              {locale.getString('literals.value')}
            </Typography>
            <TextField
              size="small"
              style={FormStyle}
              placeholder="0x0001"
              type="number"
              value={settingsStore.set_learning_mode.value}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleTextFields('value', +e.target.value)
              }
            />
          </FlexCol>
        </FlexRow>
      </Box>
    </EventHandlerContainer>
  );
};

export default observer(WriteLearningMode);
