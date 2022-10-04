import React, { useEffect } from 'react';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';
import ReviewSessionsStore from '../../ReviewSessions/store';

import SearchUploadBtn from './SearchUploadBtn';
import SessionRow from './SessionRow';
import { TablePaginationRowsPerPage } from 'Views/components/TablePagination';

import { ReviewSessionsTableContainer } from '../styles';

const SessionTable = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;

  const headers = [
    locale.getString('global.assetVariant'),
    locale.getString('testing.result'),
    locale.getString('testing.diagnosisDetails'),
    locale.getString('reviewSessions.feedbackComment')
  ];
  const renderHeaders = () => {
    return (
      <>
        {headers.map((header, i) => {
          return <TableCell key={`header-${header}`} colSpan={i === 3 ? 2 : 1} sx={{background: '#fff'}} >{header}</TableCell>;
        })}
      </>
    );
  };

  useEffect(() => reviewSessionsStore.getRdyNames(), []);

  return (
    <Box sx={{marginTop: '-8px'}}>
      <SearchUploadBtn/>
      <ReviewSessionsTableContainer sx={{ borderTop: '1px solid #eee', width: 'calc(100% + 48px)', marginLeft: '-24px'}}>
        <Table size="small" sx={{marginBottom: 1}} stickyHeader>
          <TableHead sx={{borderBottom: '1px solid #eee'}}>
            <TableRow>
              <TableCell sx={{background: '#fff'}} colSpan={1} />
              <TableCell sx={{textTransform: 'none', background: '#fff'}}>{locale.getString('global.dateAndTime')}</TableCell>
              {renderHeaders()}
              <TableCell sx={{background: '#fff'}} colSpan={1} />
            </TableRow>
          </TableHead>
          <TableBody sx={{marginBottom: 64}}>
            {reviewSessionsStore.displayedSessions?.length ?
              <SessionRow/>
              :
              <TableRow>
                <TableCell colSpan={9} sx={{textAlign: 'center'}}>{locale.getString('testing.noData')}</TableCell>
              </TableRow>
            }
          </TableBody>
          {reviewSessionsStore.displayedSessions?.length && reviewSessionsStore.totalFilteredSessions > 10 ?
            <TablePaginationRowsPerPage />
            : null
          }
        </Table>
      </ReviewSessionsTableContainer>
    </Box>
  );
};

export default observer(SessionTable);
