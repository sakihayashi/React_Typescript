import React from 'react';

import { Dialog } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import SettingsStore from '../../settingsStore';

import SchneiderConfig from './Plcs/Schneider/SchneiderConfig';

interface IProps {
  onClose: VoidFunction;
}

const PlcConfig = (props: IProps) => {
  const { onClose } = props;
  const root = useRootContext();
  const settingsStore: SettingsStore = root.settingsStore;

  const renderComponent = () => {
    switch (settingsStore.selectedPlcType) {
    case 'schneider':
      return <SchneiderConfig onClose={onClose} />;
    default:
      return <SchneiderConfig onClose={onClose} />;
    }
  };
  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="plc config" maxWidth="lg">
      {renderComponent()}
    </Dialog>
  );
};

export default observer(PlcConfig);
