import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

import LocaleStore from '@otosense/locale';

import {useRootContext} from '../../../../../RootStore';

import SearchBtnFilter from '../../components/SearchBtnFilter';
import TableRowAllSessionsRecording from '../../components/TableRowAllSessionsRecording';

import {allSessionsTableContainer, AllSessionsTableWrapper} from '../../styles';
import {cellDateTime} from '../../../../../globalStyles/otoTable';
import TablePaginationRowsPerPage from '../../components/TablePaginationRowsPerPage';


const AnalyzedAllSessions = () => {
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const dataCollectionStore = root.dataCollectionStore;
  const heads = [
    'global.dateAndTime',
    'settings.sensors',
    'global.score',
    'testing.result',
    'testing.diagnosisDetails',
    'reviewSessions.feedbackComment'
  ];
  cellDateTime.background = '#fff';
  const pageTitle = root.appState.locale.getString('testing.allCurrentSessions');

  useEffect(() => {
    document.title = pageTitle;
    dataCollectionStore.reviewSessionsStore.setRowsPerPage(50);
    dataCollectionStore.resetFilters();
  }, []);
  return (
    <AllSessionsTableWrapper>
      <SearchBtnFilter/>
      <TableContainer sx={allSessionsTableContainer}>
        <Table aria-label={pageTitle} stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{maxWidth: 115, overflow: 'hidden', minWidth: 105}}>
                {locale.getString('testing.sessionNum')}
              </TableCell>
              {heads.map((head, i) => {
                return (
                  <TableCell key={head} align="left" sx={i === 0 ? cellDateTime : null}>
                    {locale.getString(head)}
                  </TableCell>
                );
              })}
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody sx={{height: 'auto'}}>
            {!!dataCollectionStore.displayedSessions?.length
              && dataCollectionStore.displayedSessions.map((data, i) => (
                <TableRowAllSessionsRecording
                  key={data._id}
                  row={data}
                  index={i}
                  rowsStartingSessionNumber={dataCollectionStore.rowsStartingSessionNumber}
                />
              ))}
          </TableBody>
          <TablePaginationRowsPerPage/>
        </Table>
      </TableContainer>
    </AllSessionsTableWrapper>
  );
};

export default observer(AnalyzedAllSessions);
