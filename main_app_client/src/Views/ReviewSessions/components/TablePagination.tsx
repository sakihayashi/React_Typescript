import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';
import ReviewSessionsStore from '../store';
import { PaginationIconContainer } from '../styles';

export const TablePagination = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const { rowsPerPage, totalFilteredSessions, displayedSessions } =
    reviewSessionsStore;
  const [startRow, setStartRow] = useState<number>(1);
  const [lastRow, setLastRow] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(totalFilteredSessions);

  const goToPrevPage = () => {
    if (reviewSessionsStore.currentPage > 1) {
      reviewSessionsStore.prevPage();
      let currentRow: number;
      if (reviewSessionsStore.currentPage === 1) {
        currentRow = 1;
      } else {
        currentRow = (reviewSessionsStore.currentPage - 1) * 10;
      }
      setStartRow(currentRow);
      setLastRow(currentRow + rowsPerPage - 1);
    }
  };
  const goToNextPage = () => {
    const lastPageNum = Math.ceil(totalFilteredSessions / rowsPerPage);
    if (reviewSessionsStore.currentPage < lastPageNum) {
      reviewSessionsStore.nextPage();
      const currentRow = (reviewSessionsStore.currentPage - 1) * 10;
      setStartRow(currentRow);
      setLastRow(currentRow + rowsPerPage - 1);
    }
  };
  useEffect(() => {
    if (totalFilteredSessions) {
      setTotalRows(totalFilteredSessions);
    }
  }, [totalFilteredSessions]);
  return (
    <Box mt={1} sx={{ textAlign: 'center', marginLeft: -24 }}>
      <Typography variant="body1">{displayedSessions.length} &nbsp;</Typography>
      <Typography variant="body1">
        {locale.getString('reviewSessions.rows')}&nbsp;{' '}
      </Typography>
      <Typography variant="body1">{` ${startRow}-${Math.min(lastRow, totalRows)}
            ${locale.getString('reviewSessions.of')} ${
      totalFilteredSessions && totalFilteredSessions
    } `}</Typography>
      <PaginationIconContainer>
        <ChevronLeftIcon onClick={goToPrevPage} />
        {/* <FontIcon onClick={goToPrevPage}>chevron_left</FontIcon> */}{' '}
        <ChevronRightIcon onClick={goToNextPage} />
      </PaginationIconContainer>
    </Box>
  );
};

export default observer(TablePagination);
