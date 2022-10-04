import React from 'react';

import { observer } from 'mobx-react-lite';

import SystemMsg from './SystemMsg';
import SettingDetails from '../components/SettingDetails';
import CurrentData from './CurrentData';
import LatestSessions from './LatestSessions';

import { WizardMainBox } from '../../styles';

const Recording = () => {

  return (
    <WizardMainBox>
      <SystemMsg/>
      <SettingDetails/>
      <CurrentData/>
      <LatestSessions/>
    </WizardMainBox>
  );
};

export default observer(Recording);
