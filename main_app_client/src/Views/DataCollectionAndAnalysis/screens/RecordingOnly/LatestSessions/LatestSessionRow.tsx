import React from 'react';

import { observer } from 'mobx-react-lite';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { useRootContext } from '../../../../../RootStore';
import AppState from '../../../../../appState';

import SingleSensorCondition from '../../components/SingleSensorConsition';

const LatestSessionsTable = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dataCollectionStore = root.dataCollectionStore;
  const locale = root.appState.locale;
  const heads = [
    'testing.sessionNum',
    'testing.dateAndTime',
    'settings.sensors',
  ];

  return (
    <TableContainer sx={{height: 'calc(100% - 50px)', overflowY: 'auto'}}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{borderBottom: '1px solid lightgray'}}>
            {heads.map((head, i) => {
              return (
                <TableCell key={head}>
                  {locale.getString(head)}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody sx={{height: 'auto'}}>
          {!!dataCollectionStore.lastSession &&
              dataCollectionStore.last20Sessions.map((data, i, arr) => {
                return (
                  <TableRow key={`data-${data.bt}-${i}`}>
                    <TableCell>
                      {+dataCollectionStore.latestSessionNum - i}
                    </TableCell>
                    <TableCell>
                      {data &&
                        appState.formatSessionTime(data.bt)}
                    </TableCell>
                    <TableCell>
                      {!!data.sensors.length ? <SingleSensorCondition size="sm" sensors={data.sensors}/>
                        :
                        locale.getString('testing.noData')
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default observer(LatestSessionsTable);
