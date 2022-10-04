import React, {ChangeEvent, useState} from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import {observer} from 'mobx-react-lite';

import {Fields} from '../../api';
import {useRootContext} from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';
import SettingsStore from '../../settingsStore';

import AssetCombo from '../../Views/components/AssetComb';
import SoundCardTable from './SoundCardTable';
import NonSoundcardTable from './NonSoundcardTable';
import GalileoTable from './GalileoTable';

import {FlexBox, FormBox} from '../../globalStyles/otoBox';
import {firstLetterStyle} from '../../globalStyles/texts';
import {selectSensorStyle} from './styles';

interface IProps {
  onClose: VoidFunction;
}

const DeviceConfigDialog = (props: IProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const settingsStore: SettingsStore = root.settingsStore;
  const [isError, setIsError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('');
  const minErrMsg = locale.getString('settings.minNis');
  const maxErrMsg = locale.getString('settings.maxNis');
  const [errSelectDevice, setErrSelectDevice] = useState<string>('');
  const textMin = locale.getString('settings.min') + ': ';
  const textMax = locale.getString('settings.max') + ': ';
  const goToNextScreen = () => {
    if (!settingsStore.selectedReaderName) {
      setErrSelectDevice(locale.getString('settings.selectDevice'));
    } else {
      setErrSelectDevice('');
      settingsStore.nextEditConfig();
    }
  };
  const selectDevice = (e: SelectChangeEvent) => {
    if (e.target.value !== '') {
      setErrSelectDevice('');
    }
    settingsStore.setSelectedReaderName(e.target.value);
  };

  const clearAndClose = () => {
    props.onClose();
    settingsStore.resetDeviceSettings();
    assetTypeStore.resetSelected();
  };

  const renderCommonSettings = (field: any, index: number) => {
    switch (field.type) {
    case 'multiple choice':
      const strVals = field.values.map((val: number | string) => val + '');
      return (
        <FlexBox key={field.name + index}>
          <FormBox sx={{flexFlow: 'column nowrap'}}>
            <Typography variant="overline">
              {locale.getString(`settings.${field.name}`)}
            </Typography>
            <FormControl
              size={field.name !== 'sensor' ? 'small' : 'medium'}
              error={!assetTypeStore.perDeviceConfigs[field.name]}
              sx={{marginRight: 1}}
            >
              <Select
                sx={selectSensorStyle}
                value={(!!field && !!assetTypeStore.perDeviceConfigs[field.name]) ? assetTypeStore.perDeviceConfigs[field.name] + '' : ''}
                name={locale.getString(`settings.${field.name}`)}
                onChange={(e: SelectChangeEvent) =>
                  assetTypeStore.setPerDeviceConfigs(field, e.target.value)
                }
                endAdornment={
                  field.name === 'sample_rate' && (
                    <InputAdornment position="end" sx={{pr: 1}}>
                      {' ' + locale.getString('settings.hz')}
                    </InputAdornment>
                  )
                }
              >
                {strVals?.length &&
                    strVals.map((val, i) => {
                      return (
                        <MenuItem
                          key={`${val}-${i}`}
                          value={val || ''}
                          sx={firstLetterStyle}
                        >
                          {val}
                        </MenuItem>
                      );
                    })}
              </Select>
            </FormControl>
          </FormBox>
        </FlexBox>
      );
    case 'range':
      const onChangeRange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const num = e.target.value;
        if (num >= field.values.min && num <= field.values.max) {
          if (num !== null) {
            assetTypeStore.setPerDeviceConfigs(field, num);
            setIsError(false);
          }
        } else if (num < field.values.min) {
          if (num !== null) {
            assetTypeStore.setPerDeviceConfigs(field, num);
            setErrMsg(minErrMsg + ' ' + field.values.min);
            setIsError(true);
          }
        } else if (num > field.values.max) {
          if (num !== null) {
            assetTypeStore.setPerDeviceConfigs(field, num);
            setErrMsg(maxErrMsg + ' ' + field.values.max);
            setIsError(true);
          }
        }
      };

      return (
        <FormBox sx={{flexFlow: 'column nowrap', maxWidth: 240}} key={field.name + index}>
          <Typography variant="overline">
            {locale.getString(`settings.${field.name}`)}
          </Typography>
          <TextField
            aria-describedby="duration-input"
            required={true}
            error={isError}
            placeholder={
              assetTypeStore.perDeviceConfigs[field.name] ||
                textMin + field.values.min + ' ' + textMax + field.values.max
            }
            type="number"
            sx={{minWidth: 200}}
            value={!!assetTypeStore.perDeviceConfigs[field.name] ? assetTypeStore.perDeviceConfigs[field.name] + '' : ''}
            onChange={(e) => onChangeRange(e)}
            onBlur={(e) => onChangeRange(e)}
          />
          <FormHelperText sx={{minHeight: '1rem'}}>
            {isError && errMsg}
          </FormHelperText>
        </FormBox>
      );
    default:
      return null;
    }
  };

  return (
    <Dialog open={true} onClose={props.onClose} maxWidth="lg" sx={{minWidth: 500}}>
      <DialogTitle>
        <Typography variant="h2" component="header" mb={1}>
          {locale.getString('settings.deviceSettings')}
        </Typography>
        <AssetCombo/>
      </DialogTitle>
      <DialogContent>
        <FlexBox>
          <FormBox mr={1}>
            <Typography variant="overline">
              {locale.getString('settings.device')}
            </Typography>
            <FormControl size="small" error={errSelectDevice !== ''}>
              {!!settingsStore.deviceOptions?.length &&
                <Select
                  placeholder={locale.getString('settings.selectReader')}
                  value={settingsStore.selectedReaderName ? settingsStore.selectedReaderName : ''}
                  sx={firstLetterStyle}
                  name="name"
                  onChange={selectDevice}
                >
                  {settingsStore.deviceOptions.map((item, i) => {
                    if (item !== 'Files') {
                      return (
                        <MenuItem
                          key={`${item}-${i}`}
                          value={item}
                          sx={firstLetterStyle}
                        >
                          {item}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
              }
            </FormControl>
            <FormHelperText>{errSelectDevice}</FormHelperText>
          </FormBox>
          {settingsStore.isSelected &&
            !!settingsStore.perDeviceFields?.length &&
            settingsStore.perDeviceFields.map(
              (field: Fields, index: number) => {
                return renderCommonSettings(field, index);
              }
            )}
        </FlexBox>
        <hr/>
        <TableContainer>
          {!!settingsStore.pipelineReaderOptions?.length &&
            settingsStore.selectedReaderName === 'soundcard' &&
            <SoundCardTable/>
          }
          {!!settingsStore.pipelineReaderOptions?.length &&
            settingsStore.selectedReaderName === 'Galileo' &&
            <GalileoTable/>
          }
          {!!settingsStore.pipelineReaderOptions?.length &&
            !!settingsStore.selectedReader?.fields?.length &&
            settingsStore.selectedReaderName !== 'soundcard' &&
            settingsStore.selectedReaderName !== 'Galileo' &&
            <NonSoundcardTable/>
          }

        </TableContainer>
      </DialogContent>
      <DialogActions sx={{mt: 1}}>
        <Button color="cancel" onClick={clearAndClose}>
          <Typography variant="button">
            {locale.getString('literals.close')}
          </Typography>
        </Button>
        <Button
          onClick={goToNextScreen}
          disabled={
            !assetTypeStore.selectedChannel ||
            isError ||
            !assetTypeStore.perDeviceConfigs.sample_rate
          }
        >
          <Typography variant="button">
            {locale.getString('util.next')}
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(DeviceConfigDialog);
