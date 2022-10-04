import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { RootStoreContext } from '../../App';
import AppState from '../../appState';
import dppAppIllustration from '../../assets/Onboarding.svg';
import ADI_logo from '../../assets/OtoSense_logo.svg';
// import AssetTypeStore from '../../assetTypeStore';

interface IProps {
  disabled?: boolean;
  onClose: VoidFunction;
  visible: boolean;
}

const AcknowledgeDialog = (props: IProps) => {
  const rootStore = useContext(RootStoreContext);
  const appState: AppState = rootStore.appState;
  const locale: LocaleStore = appState.locale;
  const { onClose } = props;

  const closeDialog: () => void = () => {
    if (!appState.isAgreed) {
      appState.agreeToTerms();
    }
    onClose();
  };

  return (
    <Dialog
      open={props.visible}
      onClose={props.onClose}
      aria-labelledby="acknowledge_dialog"
      maxWidth="md"
    >
      <DialogTitle>
        <div className="oto-dpp__logo_modal-header">
          <div className="oto-dpp__logo_modal">
            <img src={ADI_logo} className="oto-dpp__logo_modal-img" alt="Analog Devices" />
          </div>
          <br />
          <Typography variant="h2">
            {locale.getString('dpp.welcomeDppBuilder')}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {locale.getString('dpp.whatIsDppBuilder')}
        </Typography>
        <div className="oto-dpp__welcome-dialog__img-wrapper">
          <img
            className="oto-dpp__welcome-dialog__main-img"
            src={dppAppIllustration}
            alt={locale.getString('dpp.welcomeDppBuilder')}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button disabled={appState.isLoading} onClick={closeDialog}>
          {locale.getString('literals.continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(AcknowledgeDialog);
