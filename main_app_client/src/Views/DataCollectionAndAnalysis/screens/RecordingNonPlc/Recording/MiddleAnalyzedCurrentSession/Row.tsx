import React from 'react';

import { observer } from 'mobx-react-lite';
import { TableCell, TableRow, Typography } from '@mui/material';

import { useRootContext } from '../../../../../../RootStore';

import { CurrentSessionTime, PassOrFail, ScoreTrendOrDiagnosis, SensorConditions } from '../../../components/MiddleSectionComponents';
import DonutChart from '../../../../../components/ScoreDonutChart';
import { TableCellLgId, TableCellLgSensor, TableCellLgTrend } from '../../../styles';

const Row = () => {
  const root = useRootContext();
  const dcStore = root.dataCollectionStore;

  return (
    <TableRow>
      <TableCellLgId>
        <Typography variant="h1">
          {dcStore.latestSessionNum}
        </Typography>
      </TableCellLgId>
      <TableCell >
        <CurrentSessionTime/>
      </TableCell>
      <TableCellLgSensor>
        <SensorConditions/>
      </TableCellLgSensor>
      <TableCellLgTrend>
        <ScoreTrendOrDiagnosis/>
      </TableCellLgTrend>
      <TableCell>
        <DonutChart score={dcStore.sessionHistoryQualityScoreDisplay}/>
      </TableCell>
      <TableCell>
        <PassOrFail/>
      </TableCell>
    </TableRow>
  );
};
export default observer(Row);
