import React from 'react';

import { observer } from 'mobx-react-lite';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CenterBox } from '@otosense/components';

import { useRootContext } from '../../../../RootStore';

import BottomLatestSessionsRow from './BottomLatestSessionsRow';

const LatestSessionTable = () => {
  const root = useRootContext();
  const dataCollectionStore = root.dataCollectionStore;
  const locale = root.appState.locale;
  const heads = [
    'literals.time',
    'settings.sensors',
    'global.score',
    'testing.result',
    'testing.diagnosisDetails',
    'reviewSessions.feedbackComment'
  ];

  return (
    <TableContainer sx={{height: 'calc(100% - 70px)', overflowY: 'auto'}}>
      <Table stickyHeader >
        <TableHead sx={{'::first-letter': {textTransform: 'uppercase'}}}>
          <TableRow>
            <TableCell  sx={{maxWidth: 115, backgroundColor: '#fff', textTransform: 'none', '::first-letter': {textTransform: 'uppercase'}}}>
              {dataCollectionStore?.lastSession?.rdy?.name || locale.getString('testing.sessionNum')}
            </TableCell>
            {heads.map((head, i) => {
              return (
                <TableCell key={head} sx={{backgroundColor: '#fff'}}>
                  {locale.getString(head)}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody sx={{height: 'auto'}}>
          {!!dataCollectionStore?.lastSession ?
            dataCollectionStore.last20Sessions.map((data, i) => {
              const sessionNum: number = +dataCollectionStore.latestSessionNum - i;
              return (
                <BottomLatestSessionsRow data={data} sessionNum={sessionNum} key={data._id}/>
              );
            })
            :
            <TableRow sx={{height: 'calc(100vh - 600px)'}}>
              <TableCell colSpan={8}>
                <CenterBox>
                  {locale.getString('testing.noDataAcquired')}
                </CenterBox>
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default observer(LatestSessionTable);
