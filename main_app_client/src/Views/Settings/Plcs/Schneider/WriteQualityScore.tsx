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
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { CenterBox } from '@otosense/components';

import { useRootContext } from '../../../../RootStore';
import AppState from '../../../../appState';
// import AssetTypeStore from '../../../../assetTypeStore';
import SettingsStore from '../../../../settingsStore';

import {
  EventHandlerContainer,
  FlexCol,
  FlexRow,
  FormStyle,
  innerContainer,
  rowTitle,
  Subtitle
} from './styles';

const WriteQualityScore = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  // const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const settingsStore: SettingsStore = root.settingsStore;
  const handleCheckBox = action((e: ChangeEvent<HTMLInputElement>) => {
    settingsStore.quality_score.reset_on_session_start = e.target.checked;
  });
  const headers = [
    locale.getString('settings.qsReady'),
    locale.getString('settings.qsValue'),
  ];
  const values = [
    settingsStore.quality_score.ready,
    settingsStore.quality_score.value
  ];
  const onChanges = [settingsStore.setQsReady, settingsStore.setQsValue];

  useEffect(() => {
    settingsStore.setQsValue('operation', '=');
    settingsStore.setQsReady('operation', '=');
  }, []);
  return (
    <>
      <EventHandlerContainer>
        <Typography variant="h3" sx={Subtitle}>
          {locale.getString('global.qualityScore')}
        </Typography>
        <Box sx={innerContainer}>
          {headers.map((header, i) => {
            return (
              <FlexRow key={`session-detection-${header}-${i}`} mb={1}>
                <Typography variant="h4" sx={rowTitle}>
                  {header}
                </Typography>
                <FlexCol mr={1}>
                  <Typography variant="overline">
                    {locale.getString('literals.address')}
                  </Typography>
                  <TextField
                    size="small"
                    placeholder={locale.getString('settings.enterAddress')}
                    sx={FormStyle}
                    type="number"
                    value={values[i].address && values[i].address + ''}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                      if (isNaN(+e.target.value)){
                        return;
                      } else {
                        onChanges[i]('address', +e.target.value);
                      }
                    }}
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
                {i === 0 && (
                  <>
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
                        id={`session-${header}-val-${i}`}
                        size="small"
                        style={FormStyle}
                        placeholder="0x0001"
                        type="number"
                        value={values[i].value && values[i].value + ''}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                          if (isNaN(+e.target.value)){
                            return;
                          } else { onChanges[i]('value', +e.target.value);}
                        }
                        }
                      />
                    </FlexCol>
                  </>
                )}
              </FlexRow>
            );
          })}
          <FlexRow>
            <Box />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    id="qs-reset-values"
                    onChange={handleCheckBox}
                    checked={settingsStore.quality_score.reset_on_session_start}
                  />
                }
                label={locale.getString('settings.resetValuesStart')}
              />
            </FormGroup>
          </FlexRow>
        </Box>
      </EventHandlerContainer>
    </>
  );
};

export default observer(WriteQualityScore);
