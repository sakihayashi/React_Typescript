import React, { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import { TableCellComment } from '@otosense/components';
import LocaleStore from '@otosense/locale';

import { useRootContext } from '../../../../RootStore';
import { IResultsData } from '../../../../api';

import FeedbackDialog from './FeedbackDialog';
import UploadedFeedback from './UploadedFeedback';
import SensorConditionsSm from './SensorConditionSm';

import { failTextTable, passTextTable } from '../../../../globalStyles/texts';
import { cellDateTimeL, cellSensorL } from '../../../../globalStyles/otoTable';

interface IProps {
  row: IResultsData;
  index: number;
  rowsStartingSessionNumber: number;
}

const TableRowAllSessionsRecording = (props: IProps) => {
  const { row, index, rowsStartingSessionNumber } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const root = useRootContext();
  const appState = root.appState;
  const rsStore = root.reviewSessionsStore;
  const playbackStore = root.playbackStore;
  const fontSize = {
    fontSize: 20,
    '@media (max-width:1280px)': {
      fontSize: 18,
    },
    whiteSpace: 'nowrap',
    textOverflow: 'visible'
  };
  const locale: LocaleStore = root.appState.locale;
  const dataCollectionStore = root.dataCollectionStore;
  const openDialog = () => {
    rsStore.sensorDataBase64(row._id)
      .then((sensorDataBase64: string[]) => {
        if (sensorDataBase64){
          playbackStore.setBase64Data(sensorDataBase64);
          rsStore.setSelectedSessionState(row);
        }
      })
      .then(() => setDialogOpen(true));
  };
  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { textAlign: 'left' }, height: 'auto', borderBottom: '1px solid lightgray' }} hover>
        <TableCell component="th" scope="row" align="left">
          <Typography variant="link" onClick={openDialog}>
            {row.rdy?.value || rowsStartingSessionNumber - index}
          </Typography>
        </TableCell>
        <TableCell  sx={cellDateTimeL}>{appState.formatSessionTime(row.bt)}</TableCell>
        <TableCell sx={cellSensorL}>
          {!!row.sensors?.length &&
          <SensorConditionsSm sensors={row.sensors} />
          }
        </TableCell>
        <TableCell>{typeof row.quality_score === 'number' ? row.quality_score.toFixed(1) : row.quality_score}</TableCell>
        <TableCell>{typeof row.quality_score === 'number' && row.quality_score >= 5 ? passTextTable() : failTextTable()}</TableCell>

        <TableCell>{!!row.ai_msgs?.length && locale.getString(row.ai_msgs[0].message)}</TableCell>
        <TableCellComment sx={fontSize} colSpan={2}>
          {!!row.feedback || !!row.notes ?
            <UploadedFeedback data={row} openEdit={openDialog}/>
            :
            <Typography variant="link" onClick={openDialog}>
              <Box sx={{textTransform: 'none', '::first-letter': {textTransform: 'uppercase'}}}>
                {locale.getString('reviewSessions.addFeedback')}
              </Box>
            </Typography>
          }
        </TableCellComment>
      </TableRow>
      {dialogOpen && <FeedbackDialog data={row} close={closeDialog} dpp={dataCollectionStore.isDpp} index={index}/>}
    </>
  );
};

export default observer(TableRowAllSessionsRecording);
