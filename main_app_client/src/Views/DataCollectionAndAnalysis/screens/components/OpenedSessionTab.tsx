import React from 'react';

import { observer } from 'mobx-react-lite';
import { Grid } from '@mui/material';

import { useRootContext } from '../../../../RootStore';
import RecordingDetails from './RecordingDetails';
import Diagnosis from './Diagnosis';
import Feedback from './Feedback';

import { GridForTable } from '../styles';

const OpenedSessionTab = () => {
  const root = useRootContext();
  const dcStore = root.dataCollectionStore;
  return (
    <Grid container sx={{padding: '0 8px', marginTop: '-8px'}}>
      {!!dcStore.openedTabs[dcStore.activeTab - 1] &&
      <>
        <GridForTable item xs={4}>
          <RecordingDetails/>
        </GridForTable>
        <GridForTable item xs={4} >
          <Diagnosis/>
        </GridForTable>
        <GridForTable item xs={4}>
          <Feedback/>
        </GridForTable>
      </>
      }
    </Grid>
  );
};

export default observer(OpenedSessionTab);