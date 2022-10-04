import React from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import SettingsStore from '../../settingsStore';

import AssetComb from '../components/AssetComb';
import ButtonConfig from './ButtonConfig';
import PlcConfig from './PlcConfig';
import TimerConfig from './TimerConfig';
import SaveAndCloseBtns from '../components/SaveCloseBtns';

import { SettingsBox } from './styles';

interface IProps {
  onClose: VoidFunction;
}

const ConfigEventHandlers = (props: IProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const settingsStore: SettingsStore = root.settingsStore;
  const { onClose } = props;
  const locale: LocaleStore = appState.locale;

  const cancelAndClose = () => {
    settingsStore.resetDeviceSettings();
    onClose();
  };

  const renderComponentToEdit = () => {
    switch (settingsStore.currentTriggerType) {
    case 'timer':
      return <TimerConfig />;
    case 'button':
      return <ButtonConfig />;
    default:
      return <ButtonConfig />;
    }
  };
  const saveAndClose = () => {
    settingsStore.saveConfig();
    onClose();
    settingsStore.resetDeviceSettings();
  };

  if (settingsStore.currentTriggerType === 'plc') {
    return <PlcConfig onClose={onClose} />;
  } else {
    return (
      <Dialog
        maxWidth="lg"
        open={true}
        onClose={onClose}
        aria-labelledby="dialog-device-config"
        sx={{marginTop: -5}}
      >
        <DialogTitle>
          <Typography variant="h2" component="header" sx={{ mb: 1 }}>
            {settingsStore.currentTriggerType}{' '}
            {locale.getString('settings.settings')}
          </Typography>
          <AssetComb />
        </DialogTitle>
        <DialogContent>
          <SettingsBox>{renderComponentToEdit()}</SettingsBox>
        </DialogContent>
        <DialogActions>
          <SaveAndCloseBtns
            closeFunc={cancelAndClose}
            saveFunc={saveAndClose}
            saveDisabled={settingsStore.saveBtnDisabled}
          />
        </DialogActions>
      </Dialog>
    );
  }
};

export default observer(ConfigEventHandlers);
