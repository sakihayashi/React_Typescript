import React from 'react';

import { observer } from 'mobx-react-lite';
import { TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { iconS } from '../../styles';
import InfoIcon from '@mui/icons-material/Info';
import { TextIconBox } from '@otosense/components';
import LocaleStore from '@otosense/locale';

import { useRootContext } from '../../../../../../RootStore';
import AppState from '../../../../../../appState';

import DonutChart from '../../../../../components/ScoreDonutChart';
import { CurrentSessionTime, PassOrFail, ScoreTrendOrDiagnosis, SensorConditions } from '../../../components/MiddleSectionComponents';

import { TableCellLgId, TableCellLgSensor, TableCellLgTrend } from '../../../styles';

const RowPlcCurrentSession= () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dcStore = root.dataCollectionStore;
  const locale: LocaleStore = appState.locale;

  const lastFour = dcStore.sessionHistoryHasRdyValue ? dcStore.lastSession.rdy.value.toString().slice(-4) : null;
  const tooltipText =
  <Typography variant="h3" sx={{backgroundColor: '#fff', color: '#222'}}>{dcStore.sessionHistoryHasRdyValue && dcStore.lastSession.rdy.value + ''}</Typography>;

  return (
    <TableRow>
      <TableCellLgId sx={{whiteSpace: 'nowrap'}}>
        <Typography pt="20px" variant="h1">
          {lastFour ? lastFour : dcStore.totalFilteredSessions}
        </Typography>
        {lastFour &&
        <Tooltip title={tooltipText} arrow>
          <TextIconBox>
            <Typography color="primary" variant="subtitle1" sx={{textDecoration: 'underline'}}>
              {locale.getString('testing.seeFull')}
            </Typography>
            <InfoIcon color="primary" sx={iconS}/>
          </TextIconBox>
        </Tooltip>
        }
      </TableCellLgId>
      <TableCell >
        <CurrentSessionTime/>
      </TableCell>
      <TableCellLgSensor sx={{whiteSpace: 'nowrap'}}>
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

export default observer(RowPlcCurrentSession);
