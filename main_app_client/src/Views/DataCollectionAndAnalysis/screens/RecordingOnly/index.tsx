import React, { ChangeEvent, useEffect, useState } from  'react';

import { Box, Button, Slide } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FlexSpaceBet, NavTabL, NavTabs } from '@otosense/components';

import { useRootContext } from '../../../../RootStore';
import AppState from '../../../../appState';

import { DataCollectionStore } from 'Views';
import Recording from './Recording';

import { WizardWrapper } from '../../styles';
import { firstLetterStyle } from 'globalStyles/texts';

const RecordingOnly = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale = appState.locale;
  const dataCollectionStore: DataCollectionStore = root.dataCollectionStore;
  const [view, setView] = useState<number>(0);
  const handleViewChange = (newVal: number) => {
    setView(newVal);
  };
  const navTitles = [
    locale.getString('testing.dataAcquisitionOnly'),
  ];
  let content: JSX.Element;
  switch (view) {
  case 0:
    content = (<Recording/>);
    break;
  default:
    content = (<Recording/>);
    break;
  }
  const stopTestingManual = () => {
    dataCollectionStore.stopTesting();
    dataCollectionStore.setIsStopped(true);
  };
  useEffect(() => {
    document.title = root.appState.locale.getString('testing.dataAcquisitionOnly');
  });
  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <WizardWrapper>
        <FlexSpaceBet sx={{alignItems: 'baseline'}}>
          <NavTabs
            value={view}
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
            <Button color="primary" onClick={dataCollectionStore.exitRecording}>
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

export default observer(RecordingOnly);
