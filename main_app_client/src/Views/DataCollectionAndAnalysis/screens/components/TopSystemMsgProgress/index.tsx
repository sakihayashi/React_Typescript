import { observer } from 'mobx-react-lite';
import React from 'react';
import { Grid } from '@mui/material';

import { ProgressMsg } from './styles';
import SystemMsg from '../SystemMsg';
import ProgressStepper from '../../../components/ProgressStepper';

const TopSystemMsgProgress = () => {
  return (
    <Grid container>
      <Grid item sm={6}>
        <ProgressMsg mr={0.2}>
          <ProgressStepper/>
        </ProgressMsg>
      </Grid >
      <Grid item sm={6}>
        <ProgressMsg ml={0.2}><SystemMsg/></ProgressMsg>
      </Grid>
    </Grid>
  );
};

export default observer(TopSystemMsgProgress);
