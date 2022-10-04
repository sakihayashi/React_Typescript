import React from 'react';
import {useTheme} from '@mui/material/styles';
import {Box, IconButton, TableFooter, TablePagination, TableRow} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import {ReviewSessionsStore} from '../../../ReviewSessions';
import {useRootContext} from '../../../../RootStore';
import {centerTableFooter} from '../../../../globalStyles/otoTable';
import { observer } from 'mobx-react-lite';


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
  const {onPageChange} = props;

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

  return (
    <Box sx={{flexShrink: 0}}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={rsStore.pageNum === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={rsStore.pageNum >= Math.ceil(rsStore.totalFilteredSessions / rsStore.rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
      </IconButton>
    </Box>
  );
};

const TablePaginationRowsPerPage = () => {
  const root = useRootContext();
  const rsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const dataCollectionStore = root.dataCollectionStore;
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => rsStore.setPageNum(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    rsStore.setRowsPerPage(parseInt(event.target.value, 10));
    rsStore.setPageNum(0);
    rsStore.resetPrevDisplayed();
    return dataCollectionStore.resetFilters();
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
