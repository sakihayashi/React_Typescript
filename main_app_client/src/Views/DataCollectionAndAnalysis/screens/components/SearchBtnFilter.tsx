import React, {useEffect, useState} from 'react';

import {observer} from 'mobx-react-lite';
import {Box, Button} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import LocaleStore from '@otosense/locale';
import {styled} from '@mui/material/styles';

import {useRootContext} from '../../../../RootStore';
import DataCollectionStore from 'Views/DataCollectionAndAnalysis/store';
import ReviewSessionsStore from '../../../ReviewSessions/store';
import SearchFilter from '../../../components/SearchFilter';

import { firstLetterStyle } from 'globalStyles/texts';

export const SearchFilterWrapper = styled(Box)({
  margin: 12,
  float: 'right'
});

import '../../../../globalStyles/calendar.css';

const SearchBtnFilter = () => {
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const dcStore: DataCollectionStore = root.dataCollectionStore;
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const filterTitle = locale.getString('reviewSessions.filters');
  const textClear = locale.getString('reviewSessions.clear');
  const textSearch = locale.getString('reviewSessions.search');
  const [drawerState, setDrawerState] = useState<boolean>(false);

  const searchTerms = [
    locale.getString('global.assetVariant'),
    locale.getString('global.date'),
    locale.getString('global.qualityScore'),
    locale.getString('global.feedback'),
  ];
  if (!!reviewSessionsStore.rdyNames?.length && dcStore.lastSession && dcStore.lastSession.rdy?.name) {
    searchTerms.unshift(locale.getString('global.partId'));
  }
  const toggleDrawer = () => setDrawerState(!drawerState);
  const resetFilters = () => dcStore.resetFilters();
  useEffect(reviewSessionsStore.getRdyNames, []);
  return (
    <SearchFilterWrapper>
      <Button color="secondary" onClick={toggleDrawer} startIcon={<TuneIcon/>}>
        <Box sx={firstLetterStyle}>
          {locale.getString('reviewSessions.filters')}
        </Box>
      </Button>
      <SearchFilter
        searchTerms={searchTerms}
        drawerState={drawerState}
        toggleState={toggleDrawer}
        title={filterTitle}
        btnTxtSearch={textSearch}
        btnTxtClear={textClear}
        resetFilters={resetFilters}
        formatAndCallSetFilters={dcStore.filterSessionHistory}
      />
    </SearchFilterWrapper>
  );
};

export default observer(SearchBtnFilter);
