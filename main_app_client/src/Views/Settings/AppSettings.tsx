import React from 'react';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import SettingsStore from '../../settingsStore';
import { RenderFunction } from '../../Utility/types';

const AppSettings = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;

  const renderSoftwareUpdates: RenderFunction = () => {

    return (
      <>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={appState.config.automatic_software_updates}
                onChange={(e) =>
                  settingsStore.setSettingsConfig(
                    e.target.checked,
                    'automatic_software_updates'
                  )
                }
              />
            }
            label={locale.getString('settings.allowAutomaticUpdates')}
          />
        </FormGroup>
        <Box textAlign="right">
          <Button onClick={settingsStore.saveOTASettings}>
            <Typography variant="button">
              {locale.getString('literals.save')}
            </Typography>
          </Button>
        </Box>
      </>
    );
  };


  return (
    <main>
      <hr />
      <Typography variant="h2">{locale.getString('settings.automateUpdate')}</Typography>
      <Typography variant="h3" mt={1}>{locale.getString('settings.softwareUpdates')}</Typography>
      <Box mt={1}>{renderSoftwareUpdates()}</Box>
    </main>
  );
};

export default observer(AppSettings);
