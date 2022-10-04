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

interface IProps {
  closeDialog?: VoidFunction;
}

const CancelDiglog = (props: IProps) => {
  const { closeDialog } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const locale: LocaleStore = appState.locale;

  return (
    <Dialog
      open={true}
      onClose={closeDialog}
      aria-labelledby="dialog-cancel-wizard"
      sx={{ zIndex: 29 }}
    >
      <DialogTitle>
        <WarningIcon className="oto-icon-warning oto-spacer--mr-1rem" />
        <div className="oto-dialog-title">
          {locale.getString('wizard.leaveDppBuilderWizard')}
        </div>
      </DialogTitle>
      <DialogContent>
        {locale.getString('wizard.changesWillNotBeSaved')}
      </DialogContent>
      <DialogActions>
        <Button color="cancel" onClick={closeDialog} mr={1}>
          {locale.getString('wizard.keepBuildingDPP')}
        </Button>
        <Button
          color="error"
          disabled={appState.isLoading}
          onClick={dppWizardStore.cancelWizard}
        >
          {locale.getString('wizard.leaveDppBuilder')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(CancelDiglog);
