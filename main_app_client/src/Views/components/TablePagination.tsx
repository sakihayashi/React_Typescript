import * as React from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, IconButton, TableFooter, TablePagination, TableRow } from '@mui/material';
import { observer } from 'mobx-react-lite';
// import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// import LastPageIcon from '@mui/icons-material/LastPage';

import { useRootContext } from '../../RootStore';
// import AppState from '../../appState';
import ReviewSessionsStore from '../ReviewSessions/store';
import { PromiseFunction } from '../../Utility/types';

import { centerTableFooter } from '../../globalStyles/otoTable';

interface TablePaginationActionsProps {
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const root = useRootContext();
  const rsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const theme = useTheme();
  const { onPageChange } = props;

  // const handleFirstPageButtonClick = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  // ) => {
  //   onPageChange(event, 0);
  //   rsStore.firstPage();
  // };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const prevPageNum = rsStore.pageNum - 1;
    onPageChange(event, prevPageNum);
    rsStore.prevPage();
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextPageNum = rsStore.pageNum + 1;
    rsStore.setPageNum(nextPageNum);
    rsStore.nextPage();
  };

  // const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   onPageChange(event, Math.max(0, Math.ceil(rsStore.totalFilteredSessions / rsStore.rowsPerPage) - 1));
  //   rsStore.lastPage();
  // };

  return (
    <Box sx={{ flexShrink: 0 }}>
      {/* <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={rsStore.pageNum === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton> */}
      <IconButton
        onClick={handleBackButtonClick}
        disabled={rsStore.pageNum === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={rsStore.pageNum >= Math.ceil(rsStore.totalFilteredSessions / rsStore.rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      {/* <IconButton
        onClick={handleLastPageButtonClick}
        disabled={rsStore.pageNum >= Math.ceil(rsStore.totalFilteredSessions / rsStore.rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton> */}
    </Box>
  );
};

export const TablePaginationRowsPerPage = () => {
  const root = useRootContext();
  const rsStore: ReviewSessionsStore = root.reviewSessionsStore;
  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    rsStore.setPageNum(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newVal = event.target.value;
    rsStore.setRowsPerPage(parseInt(newVal, 10));
    rsStore.initializeExpandedRows(parseInt(newVal, 10));
    rsStore.setPageNum(0);
    rsStore.resetPrevDisplayed();
    handleFilter();
  };
  const handleFilter: PromiseFunction = () => {
    return rsStore.setFilters(
      null,
      null, // DATE
      null,
      null, // QUALITY SCORE
      false,
      null, // FEEDBACK
      false
    );
  };

  return (
    <TableFooter sx={centerTableFooter}>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          colSpan={10}
          count={rsStore.totalFilteredSessions}
          rowsPerPage={rsStore.rowsPerPage}
          page={rsStore.pageNum}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
};

export default observer(TablePaginationRowsPerPage);