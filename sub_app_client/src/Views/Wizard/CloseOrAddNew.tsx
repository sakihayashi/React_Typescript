import WarningIcon from '@mui/icons-material/Warning';
import { Button } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRootContext } from '../../App';
import AppState from '../../appState';
import SuccessMan from '../../assets/success-man.svg';
import DppWizardStore from './store';

const CloseOrAddNew = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;

  const closeWindow = () => {
    appState.closeApp();
  };

  const goBackToList = () => {
    appState.backToDppList();
    dppWizardStore.setIsLastStep(false);
    dppWizardStore.resetAllSettings();
  };
  const errorMsg = (
    <>
      <WarningIcon className="oto-wizard__warning-icon" sx={{width: 80, height: 80}}/>
      <header className="oto-text_h2 oto-spacer--mt1rem-mb-2rem">
        {locale.getString('wizard.errorDppNotSaved')}
      </header>
    </>
  );
  const successMsg = (
    <>
      <img
        src={SuccessMan}
        alt={locale.getString('wizard.successfullySaved')}
      />
      <header className="oto-text_h2 oto-spacer--mt1rem-mb-2rem">
        {locale.getString('wizard.successfullySaved')}
      </header>
    </>
  );

  return (
    <div className="oto-wizard__success">
      {dppWizardStore.isDppSaved ? successMsg : errorMsg}
      <div className="oto-wizard__success_btn_wrapper">
        <Button color="cancel" mr={1} onClick={closeWindow}>
          {locale.getString('wizard.closeDppBuilder')}
        </Button>
        <Button onClick={goBackToList}>
          {locale.getString('wizard.createNewPipeline')}
        </Button>
      </div>
    </div>
  );
};

export default observer(CloseOrAddNew);
