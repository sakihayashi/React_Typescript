import React, { ChangeEvent, useEffect } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { FlexBox, FormBox } from '@otosense/components';
// import { toJS } from 'mobx';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import SettingsStore from '../../settingsStore';
import { replaceToNumeric, validateInteger, ValidateIPaddress } from '../../Utility/helper';

import AssetComb from '../components/AssetComb';
import { FormControlSelect } from '../../globalStyles/otoBox';
import SaveCloseBtns from '../components/SaveCloseBtns';

interface IProps {
  onClose: VoidFunction;
}

const SelectEventHandlers = (props: IProps) => {
  const { onClose } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;

  const triggerTypes = [
    locale.getString('settings.timer'),
    locale.getString('settings.usbButton'),
    locale.getString('settings.plc'),
  ];
  const ipAddress_port = [
    {name: 'ip_address', type: 'text', inputProps: {maxLength: 15, pattern: '^([0-9a-fA-F]{4}:){7}[0-9a-fA-F]{4}$'}, placeholder: 'xxx.xxx.xxx.xxx' },
    {name: 'port_number', type: 'number', inputProps: { step: 1, maxLength: 6}}
  ];
  const triggerTypeEn = ['timer', 'button', 'plc'];
  const plcOptions = [locale.getString('settings.schneider')];
  const errorHandlers = [
    ValidateIPaddress,
    validateInteger,
  ];
  settingsStore.setSelectedPlcType(plcOptions[0]);
  const cancelAndClose = () => {
    onClose();
    settingsStore.resetDeviceSettings();
  };
  const goToNext = () => {
    settingsStore.nextEditConfig();
  };
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    const name = e.target.name;
    if (name === 'ip_address'){
      const onlyNumeric = replaceToNumeric(val);
      if (!!onlyNumeric || val === ''){
        settingsStore.setPlcConfig(name, onlyNumeric);
      }
    } else if (name === 'port_number') {
      if (validateInteger(val) || val === ''){
        settingsStore.setPlcConfig(name, val);
      }
    }
  };
  if (settingsStore.currentTriggerType !== 'plc'){
    settingsStore.setDisabledNext(false);
  }
  useEffect(() => {
    if (settingsStore.currentTriggerType === 'plc' && ValidateIPaddress(settingsStore.plc_cfg.ip_address) && validateInteger(settingsStore.plc_cfg.port_number + '')){
      settingsStore.setDisabledNext(false);
    } else {
      settingsStore.setDisabledNext(true);
    }
  }, [settingsStore.plc_cfg.ip_address, settingsStore.plc_cfg.port_number]);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" sx={appState.touchScreenMode ? {top: -200} : {}}>
      <DialogTitle>
        <Typography variant="h2" component="header" mb={1}>
          {locale.getString('settings.selectEventHandler')}
        </Typography>
        <AssetComb />
      </DialogTitle>

      <DialogContent>
        <FormControl sx={{ height: 'auto', width: 'auto', display: 'flex', alignItems: 'center' }}>
          <RadioGroup
            aria-label={locale.getString('settings.selectEventHandler')}
            defaultValue={triggerTypes[0]}
          >
            {triggerTypes.map((type, i) => {
              return (
                <FlexBox key={`event-handler-${type}`}>
                  <FormControlLabel
                    sx={{
                      width: 150,
                      '& .MuiTypography-root:first-letter': {
                        textTransform: 'uppercase',
                      },
                    }}
                    value={triggerTypeEn[i]}
                    control={
                      <Radio
                        name={triggerTypeEn[i]}
                        onChange={settingsStore.setCurrentTriggerType}
                        checked={
                          settingsStore.currentTriggerType === triggerTypeEn[i]
                        }
                        inputProps={{
                          'aria-label': type,
                        }}
                      />
                    }
                    label={type}
                  />
                  {triggerTypeEn[i] === 'plc' && settingsStore.currentTriggerType === 'plc' && (
                    <FlexBox>
                      <FormBox>
                        <Typography variant="overline">
                          {locale.getString('settings.plc')}
                        </Typography>
                        <FormControlSelect size="small" sx={{marginRight: 1 }}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={settingsStore.selectedPlcType}
                            label="Age"
                            onChange={(e: SelectChangeEvent) =>
                              settingsStore.setSelectedPlcType(e.target.value)
                            }
                            size="small"
                          >
                            {plcOptions.map((opt) => {
                              return (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControlSelect>
                      </FormBox>

                      {ipAddress_port.map((data, index) => {
                        return (
                          <FormBox key={`${data.name}-${index}`} mr={1}>
                            <Typography variant="overline">{locale.getString('settings.' + data.name)}</Typography>
                            <TextField
                              size="xsmall"
                              error={!errorHandlers[index](settingsStore.plc_cfg[data.name] + '')}
                              required={settingsStore.currentTriggerType === 'plc'}
                              name={data.name}
                              value={settingsStore.plc_cfg[data.name] + ''}
                              inputProps={data.inputProps}
                              type={data.type}
                              placeholder={data.placeholder && data.placeholder}
                              onChange={handleTextChange}
                              onBlur={handleTextChange}
                              sx={{height: 45}}
                            />
                          </FormBox>
                        );
                      })}
                    </FlexBox>
                  )}

                </FlexBox>
              );
            })}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <SaveCloseBtns
          closeFunc={cancelAndClose}
          saveFunc={goToNext}
          isNext={true}
          saveDisabled={settingsStore.disableNext}
        />
      </DialogActions>
    </Dialog>
  );
};

export default observer(SelectEventHandlers);
