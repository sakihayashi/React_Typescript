import React, { useState } from 'react';

import TuneIcon from '@mui/icons-material/Tune';
import { observer } from 'mobx-react-lite';
import { Box, Button, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';

import { useRootContext } from '../../../RootStore';
import ReviewSessionsStore from '../store';

import SearchFilter from '../../components/SearchFilter';

const SearchUploadBtn = () => {
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const [drawerState, setDrawerState] = useState<boolean>(false);
  const searchTerms = [
    locale.getString('global.assetType'),
    locale.getString('global.assetVariant'),
    locale.getString('global.date'),
    locale.getString('global.qualityScore'),
    locale.getString('global.feedback'),
  ];
  if (!!reviewSessionsStore.rdyNames?.length){
    searchTerms.unshift(locale.getString('global.partId'));
  }
  const filterTitle = locale.getString('reviewSessions.filters');
  const textClear = locale.getString('reviewSessions.clear');
  const textSearch = locale.getString('reviewSessions.search');

  const toggleState = () => {
    setDrawerState(!drawerState);
  };

  return (
    <Box sx={{ float: 'right', mb: '16px' }}>
      <Button color="secondary" onClick={toggleState} startIcon={<TuneIcon />}>
        <Typography variant="button">
          {locale.getString('reviewSessions.filters')}
        </Typography>
      </Button>
      <SearchFilter
        searchTerms={searchTerms}
        drawerState={drawerState}
        toggleState={toggleState}
        title={filterTitle}
        btnTxtSearch={textSearch}
        btnTxtClear={textClear}
        resetFilters={reviewSessionsStore.resetFilters}
        formatAndCallSetFilters={
          reviewSessionsStore.formatAndCallSetFilters
        }
      />
    </Box>
  );
};

export default observer(SearchUploadBtn);
