import React from 'react';

import { useRootContext } from '../../../../../../RootStore';
import LocaleStore from '@otosense/locale';

import { observer } from 'mobx-react-lite';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import AppState from '../../../../../../appState';

import Row from './Row';
import NoDataAcquired from '../../../components/NoDataAcquired';

import { CurrentAnalyzedBox } from '../../../../styles';

const CurrentAnalyzedData = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dataCollectionStore = root.dataCollectionStore;
  const locale: LocaleStore = appState.locale;
  const tableHeads = [
    dataCollectionStore.sessionHistoryHasRdyName ? dataCollectionStore.lastSession.rdy.name : locale.getString('testing.latestSessionNum'),
    locale.getString('literals.time'),
    locale.getString('settings.sensors'),
    dataCollectionStore.sessionHistoryHasQualityScore ? locale.getString('testing.last10Scores') : locale.getString('testing.diagnosisDetails'),
    locale.getString('global.score'),
    locale.getString('testing.result')
  ];
  return (
    <CurrentAnalyzedBox>
      <TableContainer sx={{overflowY: 'hidden'}}>
        <Table>
          <TableHead sx={{borderBottom: '1px solid lightgray'}}>
            <TableRow>
              {tableHeads.map((head, i) => {
                return (
                  <TableCell key={head}>
                    <Typography variant="subtitle1" color="inherit">
                      {head}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody sx={{height: 125}}>
            {!!dataCollectionStore.lastSession ? <Row /> : <NoDataAcquired />}
          </TableBody>
        </Table>
      </TableContainer>
    </CurrentAnalyzedBox>
  );
};

export default observer(CurrentAnalyzedData);
