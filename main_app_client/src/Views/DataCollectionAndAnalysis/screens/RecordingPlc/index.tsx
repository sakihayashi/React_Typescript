import React, { ChangeEvent, useEffect } from  'react';

import { Box, Button, Slide } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FlexSpaceBet, NavTabL, NavTabs } from '@otosense/components';
import LocaleStore from '@otosense/locale';

import AppState from '../../../../appState';
import { DataCollectionStore } from 'Views';
import { useRootContext } from '../../../../RootStore';

import RealtimeAnalysisPlc from './PlcTestRecoding';
import AnalyzedAllSessions from './AnalyzedAllSessions';

import { WizardWrapper } from '../../styles';
import { firstLetterStyle } from 'globalStyles/texts';

const RecordingPlc = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dataCollectionStore: DataCollectionStore = root.dataCollectionStore;
  const locale: LocaleStore = appState.locale;
  const navTitles = [
    locale.getString('testing.realtimeDataAnalysisPlc'),
    locale.getString('testing.allCurrentSessions')
  ];
  const stopTestingManual = () => {
    dataCollectionStore.stopTesting();
    dataCollectionStore.setIsStopped(true);
    dataCollectionStore.setTestManuallyStopped(true);
  };
  const handleViewChange = (newVal: number) => {
    dataCollectionStore.setPlcView(newVal);
  };
  let content: JSX.Element;
  switch (dataCollectionStore.plcView) {
  case 0:
    content = (<RealtimeAnalysisPlc/>);
    break;
  case 1:
    content = (<AnalyzedAllSessions/>);
    break;
  }
  useEffect(() => {
    dataCollectionStore.setPlcView(0);
  }, []);

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <WizardWrapper>
        <FlexSpaceBet sx={{alignItems: 'baseline'}}>
          <NavTabs
            value={dataCollectionStore.plcView}
            onChange={(e: ChangeEvent<HTMLInputElement>, newValue: number) => handleViewChange(newValue)}
          >
            {navTitles.map((v: string, i: number) => {
              return (<NavTabL label={v} key={v} />);
            })}
          </NavTabs>
          {dataCollectionStore.testStatus.is_running ?
            <Button  color="error" onClick={stopTestingManual}>
              <Box sx={firstLetterStyle}>
                {locale.getString('testing.stop')}
              </Box>
            </Button>
            :
            <Button  color="primary" onClick={dataCollectionStore.exitRecording}>
              <Box sx={firstLetterStyle}>
                {locale.getString('testing.finish')}
              </Box>
            </Button>
          }
        </FlexSpaceBet>
        {content}
      </WizardWrapper>
    </Slide>
  );
};

export default observer(RecordingPlc);
