import React from 'react';

import { observer } from 'mobx-react-lite';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { CurrentAnalyzedBox } from '../../styles';
import LocaleStore from '@otosense/locale';
// import { toJS } from 'mobx';

import { useRootContext } from '../../../../../../RootStore';
import AppState from '../../../../../../appState';

import RowPlcCurrentSession from './RowPlcCurrentSession';
import NoDataAcquired from '../../../components/NoDataAcquired';

export const RdyValueStyle = {
  whiteSpace: 'nowrap',
  maxWidth: 170,
  textOverFlow: 'ellipsis',
  overflowX: 'hidden'
};

const CurrentAnalyzedData = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dcStore = root.dataCollectionStore;
  const locale: LocaleStore = appState.locale;
  const tableHeads = [
    dcStore.lastSession?.rdy?.name || locale.getString('testing.latestSessionNum'),
    locale.getString('literals.time'),
    locale.getString('settings.sensors'),
    dcStore.lastSession?.quality_score !== 'N/A' ? locale.getString('testing.last10Scores') : locale.getString('testing.diagnosisDetails'),
    locale.getString('global.score'),
    locale.getString('testing.result')
  ];


  return (
    <CurrentAnalyzedBox>
      <TableContainer sx={{overflowY: 'hidden'}}>
        <Table>
          <TableHead>
            <TableRow sx={{borderBottom: '1px solid lightgray'}}>
              {tableHeads.map((head, i) => {
                return (
                  <TableCell key={head}>
                    <Typography variant="subtitle1" color="inherit" sx={i === 0 ? {RdyValueStyle} : null}>
                      {head}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody sx={{height: 125}}>
            {dcStore.lastSession ?
              <RowPlcCurrentSession />
              :
              <NoDataAcquired />
            }
          </TableBody>
        </Table>
      </TableContainer>
    </CurrentAnalyzedBox>
  );
};

export default observer(CurrentAnalyzedData);
