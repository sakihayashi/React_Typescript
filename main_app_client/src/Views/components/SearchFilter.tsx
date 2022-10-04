import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Drawer, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react';
import { InfoTextWithTooltip } from '@otosense/components';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import { ReviewSessionsStore } from 'Views/ReviewSessions';

import {
  RenderAssetTypeFilter,
  RenderAssetVariantFilter,
  RenderDateTimePicker,
  RenderFeedbackFilter,
  RenderQualityDropDown,
  RenderRdyFilter
} from './FilterFunctions';

import { styled } from '@mui/material/styles';
import { firstLetterStyle } from 'globalStyles/texts';

export const SearchFooter = styled(Box)({
  position: 'absolute',
  bottom: 0,
  textAlign: 'right',
  width: '100%',
  height: '86px',
  padding: '1rem',
  backgroundColor: '#a3a6b4',
});

export const SearchHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  background: '#f3f3f3',
  padding: '18px',
});

interface IProps {
  searchTerms: string[];
  drawerState: boolean;
  toggleState: VoidFunction;
  title: string;
  btnTxtSearch: string;
  btnTxtClear: string;
  resetFilters: VoidFunction;
  formatAndCallSetFilters: VoidFunction;
}

export const SearchFilter = (props: IProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const rsStore: ReviewSessionsStore = root.reviewSessionsStore;

  const {
    searchTerms,
    drawerState,
    toggleState,
    title,
    btnTxtSearch,
    btnTxtClear,
    resetFilters,
    formatAndCallSetFilters,
  } = props;

  const renderComponents = (name: string) => {
    switch (name) {
    case locale.getString('global.qualityScore'):
      return <RenderQualityDropDown />;
    case locale.getString('global.feedback'):
      return <RenderFeedbackFilter />;
    case locale.getString('global.date'):
      return <RenderDateTimePicker />;
    case locale.getString('global.assetType'):
      return <RenderAssetTypeFilter />;
    case locale.getString('global.assetVariant'):
      return <RenderAssetVariantFilter />;
    case locale.getString('global.partId'):
      return <RenderRdyFilter />;
    default:
      break;
    }
  };

  const rdyExplained =
  (<Box sx={{height: 'auto'}}>
    <Typography variant="body2" pt={0.5} pr={1} pl={1} color="common.white">
      {locale.getString('reviewSessions.partIdExplained')}
    </Typography>
    <hr />
    <ul>
      {!!rsStore.rdyNames?.length &&
      rsStore.rdyNames.map(name => {
        return (
          <li key={name}>
            <Typography variant="subtitle1" color="common.white">{name}</Typography>
          </li>
        );
      })
      }
    </ul>
  </Box>);

  return (
    <Drawer anchor="right" open={drawerState} onClose={toggleState}>
      <SearchHeader>
        <Typography variant="h3">{title}</Typography>
        <Box onClick={toggleState} sx={{ '&:hover': { cursor: 'pointer' } }}>
          <CloseIcon color="primary" />
        </Box>
      </SearchHeader>
      {searchTerms.map((term, i) => {
        return (
          <Accordion key={`search-filter-${term}-${i}`} disableGutters={true} sx={{overflow: 'scroll'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id={`filter-header-${term}`}
            >
              <Typography variant="body2" mr={1} sx={firstLetterStyle}>
                {term}
              </Typography>
              {rsStore.rdyNames.length && term === locale.getString('global.partId') ?
                <InfoTextWithTooltip
                  infoText={locale.getString('reviewSessions.whatIsPartId')}
                  tooltipJSX={rdyExplained}
                />
                : ''
              }
            </AccordionSummary>
            <AccordionDetails>{renderComponents(term)}</AccordionDetails>
          </Accordion>
        );
      })}
      <SearchFooter>
        <Button color="cancel" sx={{ mr: 1 }} onClick={resetFilters}>
          <Typography variant="button">
            {btnTxtClear}
          </Typography>
        </Button>
        <Button
          sx={{ mr: 1 }}
          onClick={formatAndCallSetFilters}
          disabled={rsStore.filterBtnDisabled}
        >
          <Typography variant="button">
            {btnTxtSearch}
          </Typography>
        </Button>
      </SearchFooter>
    </Drawer>
  );
};

export default observer(SearchFilter);
