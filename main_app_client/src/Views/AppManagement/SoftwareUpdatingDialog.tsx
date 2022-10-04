import React from 'react';

import { observer } from 'mobx-react-lite';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import { InfoTextWithTooltip, LinearProgressWithLabel } from '@otosense/components';

import { TextTransformNone } from '../../globalStyles/texts';

const SoftwareUpdatingDialog = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  return (
    <Dialog open={appState.isSoftwareUpdating} maxWidth="md">
      <DialogTitle>
        <TextTransformNone variant="h2" mb={0.5}>
          {locale.getString('login.softwareUpdateInProgress')}
        </TextTransformNone>
        <InfoTextWithTooltip infoText={locale.getString('general.whyDoISeeThis')} tooltipText={locale.getString('general.updateSoftwareInfo')}/>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3" mb={0.5}>{locale.getString('literals.processing')} ...</Typography>
        <LinearProgressWithLabel value={28} sx={{height: 10}}/>
      </DialogContent>
    </Dialog>
  );
};

export default observer(SoftwareUpdatingDialog);
