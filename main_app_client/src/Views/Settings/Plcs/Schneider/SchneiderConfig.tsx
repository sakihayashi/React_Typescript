import React, { useEffect, useState } from 'react';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../../../RootStore';
import AppState from '../../../../appState';
import SettingsStore from '../../../../settingsStore';

import AssetComb from '../../../components/AssetComb';
import ReadAddress from './ReadAddress';
import ReadSession from './ReadSession';
import WriteReady from './WriteReady';
import WriteValue from './WriteValue';

import { textCapitalize } from './styles';

interface IProps {
  onClose: VoidFunction;
}

const SchneiderConfig = (props: IProps) => {
  const { onClose } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const contents = [
    <ReadSession key="plc-read-session" />,
    <ReadAddress key="plc-read-address" />,
    <WriteReady key="plc-write-ready" />,
    <WriteValue key="plc-write-val" />,
  ];
  const readOrWrite = [
    locale.getString('settings.readSettings'),
    locale.getString('settings.readSettings'),
    locale.getString('settings.writeSetting'),
    locale.getString('settings.writeSetting'),
  ];
  const cancelClose = () => {
    onClose();
  };
  const goToNext = () => {
    if (currentIndex <= contents.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const saveSettings = () => {
    settingsStore.saveConfig();
    onClose();
  };
  useEffect(() => {
    settingsStore.setPlcConfig('source', 'Schneider');
  }, []);
  return (
    <>
      <DialogTitle sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="h2" component="header" sx={{ mt: 0, mb: 1, ml: 0, mr: 0 }}>
          <span style={textCapitalize}>
            {locale.getString('settings.schneider') + ' '}
          </span>
          <span style={{ textTransform: 'uppercase' }}>
            {locale.getString('settings.plc') + ' '}
          </span>
          -<span>{readOrWrite[currentIndex]}</span>
        </Typography>
        <div>
          <AssetComb />
        </div>
      </DialogTitle>
      <DialogContent style={{ paddingBottom: 0, paddingTop: 0, marginBottom: 1 }}>
        {contents[currentIndex]}
      </DialogContent>
      <DialogActions sx={{marginTop: 1}}>
        <Button onClick={cancelClose} color="cancel">
          <Typography variant="button">
            {locale.getString('literals.close')}
          </Typography>
        </Button>
        {contents.length === currentIndex + 1 ? (
          <Button onClick={saveSettings}>
            <Typography variant="button">
              {locale.getString('literals.save')}
            </Typography>
          </Button>
        ) : (
          <Button onClick={goToNext} disabled={settingsStore.disableNext}>
            <Typography variant="button">
              {locale.getString('util.next')}
            </Typography>
          </Button>
        )}
      </DialogActions>
    </>
  );
};
export default observer(SchneiderConfig);
