import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  TableCell,
  TableRow,
} from '@mui/material';
import { StyledCollapse } from '../../../globalStyles/otoTable';
import RecordingDetails from './RecordingDetails';
import { IResultsData } from '../../../api';
import Diagnosis from './Diagnosis';
import Feedback from './Feedback';

interface IProps {
  open: boolean;
  data: IResultsData;
}

const CollapsedContents = (props: IProps) => {
  const { open, data } = props;

  return (
    <TableRow sx={{width: '100%'}}>
      <TableCell sx={{p: 0}} colSpan={11}>
        <StyledCollapse in={open} timeout="auto" unmountOnExit>
          <Grid container>
            <Grid item sm={4}><RecordingDetails data={data}/></Grid>
            <Grid item sm={4}><Diagnosis data={data}/></Grid>
            <Grid item sm={4}><Feedback data={data}/></Grid>
          </Grid>
        </StyledCollapse>
      </TableCell>
    </TableRow>
  );
};

export default observer(CollapsedContents);