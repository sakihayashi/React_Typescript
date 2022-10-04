import WarningIcon from '@mui/icons-material/Warning';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRootContext } from "../../App";
import AppState from "../../appState";
import { DppWizardStore } from ".";

const ApiErrorDiglog = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const locale: LocaleStore = appState.locale;

  return (
    <Dialog
      open={true}
      onClose={dppWizardStore.toggleApiErrorDialog}
      aria-labelledby="dialog-cancel-wizard"
    >
      <DialogTitle>
        <WarningIcon className="oto-icon-warning oto-spacer--mr-1rem" />
        {locale.getString('wizard.tryAgain')}
      </DialogTitle>
      <DialogContent>
        {locale.getString('wizard.errorWithYourInput')}
        <p>{dppWizardStore.errorMsg && dppWizardStore.errorMsg}</p>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={appState.isLoading}
          onClick={dppWizardStore.toggleApiErrorDialog}
          sx={{ textTransform: 'uppercase' }}
        >
          {locale.getString('literals.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(ApiErrorDiglog);
