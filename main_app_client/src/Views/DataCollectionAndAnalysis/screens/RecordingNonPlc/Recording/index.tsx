import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../../../../RootStore';
import SettingDetails from '../../components/SettingDetails';
import CurrentAnalyzedData from './MiddleAnalyzedCurrentSession';
import TopSystemMsgProgress from '../../components/TopSystemMsgProgress';
import BottomLatestSessionsIndex from '../../components/BottomLatestSessionsIndex';

import { WizardMainBox } from '../../../styles';

const RealtimeAnalysisNonPlc = () => {
  const root = useRootContext();
  useEffect(() => {
    document.title = root.appState.locale.getString('testing.realtimeDataAnalysis');
  });
  return (
    <WizardMainBox>
      <TopSystemMsgProgress/>
      <SettingDetails/>
      <CurrentAnalyzedData />
      <BottomLatestSessionsIndex/>
    </WizardMainBox>
  );
};

export default observer(RealtimeAnalysisNonPlc);
