import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useRootContext } from "../../App";
import AppState from "../../appState";
import ApiErrorDiglog from "./ApiErrorDialog";
import CancelDialog from "./CancelDialog";
import { DppWizardStore } from ".";

export const WizardFooter = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const locale: LocaleStore = appState.locale;
  const [cancelDialog, setCancelDialog] = useState(false);

  const closeDialog = () => {
    setCancelDialog(false);
  };

  return (
    <div className="oto-wizard-footer">
      <div className="oto-wizard-footer__block">
        <div className="oto-wizard-footer__wrapper">
          <div className="oto-flex-box">
            <Button
              color="secondary"
              onClick={dppWizardStore.prevStep}
              disabled={!dppWizardStore.backBtnState}
              sx={{ mr: 1 }}
            >
              <ChevronLeftIcon />
              {locale.getString('literals.back')}
            </Button>
            <Button color="cancel" onClick={() => setCancelDialog(true)}>
              {locale.getString('literals.cancel')}
            </Button>
          </div>
          <Button
            disabled={!dppWizardStore.nextBtnState}
            onClick={dppWizardStore.nextStep}
          >
            {dppWizardStore.step > 3 ? (
              locale.getString('literals.save')
            ) : (
              <>
                {locale.getString('literals.next')}
                <ChevronRightIcon />
              </>
            )}
          </Button>
        </div>
      </div>
      {cancelDialog && <CancelDialog closeDialog={closeDialog} />}
      {dppWizardStore.apiErrorDialog && <ApiErrorDiglog />}
    </div>
  );
};

export default observer(WizardFooter);
