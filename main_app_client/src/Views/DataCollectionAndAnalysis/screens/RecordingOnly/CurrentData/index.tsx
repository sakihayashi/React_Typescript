import React from 'react';

import { observer } from 'mobx-react-lite';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';

import { useRootContext } from '../../../../../RootStore';
import AppState from '../../../../../appState';

import NoDataAcquired from '../../components/NoDataAcquired';
import { CurrentSessionTime, SensorConditions } from '../../components/MiddleSectionComponents';

import { CurrentDataContainer } from '../styles';

const CurrentData = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dataCollectionStore = root.dataCollectionStore;
  const locale: LocaleStore = appState.locale;
  const tableHeads = [
    'testing.latestSessionNum',
    'literals.time',
    'Sensors',
  ];

  return (
    <CurrentDataContainer>
      <TableContainer sx={{overflowY: 'hidden'}}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeads.map((head, i) => {
                return (
                  <TableCell key={head}>
                    <Typography variant="subtitle1" color="inherit">
                      {locale.getString(head)}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {!!dataCollectionStore.lastSession ?
              <TableRow>
                <TableCell >
                  <Typography pt="20px" variant="h1">{dataCollectionStore.latestSessionNum || ''}</Typography>
                </TableCell>
                <TableCell >
                  <CurrentSessionTime/>
                </TableCell>
                <TableCell>
                  <SensorConditions/>
                </TableCell>
              </TableRow>
              :
              <NoDataAcquired/>
            }

          </TableBody>
        </Table>
      </TableContainer>
    </CurrentDataContainer>
  );
};

export default observer(CurrentData);
