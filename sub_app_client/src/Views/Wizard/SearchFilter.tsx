import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useRootContext } from '../../App';
import AppState from '../../appState';
import {
  //   RenderAssetTypeFilter,
  //   RenderAssetVariantFilter,
  RenderDateFilter,
  RenderFeedbackFilter,
  RenderQualityDropDown,
} from './FilterFunctions';
import { SearchFooter, SearchHeader } from './styles';

interface IProps {
  searchTerms: string[];
  drawerState: boolean;
  toggleState: VoidFunction;
  title: string;
  btnTxtSearch: string;
  btnTxtClear: string;
  resetFilters: VoidFunction;
  handleFilterPipeline: VoidFunction;
}

export const SearchFilter = (props: IProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const dppWizardStore = root.dppWizardStore;
  const {
    searchTerms,
    drawerState,
    toggleState,
    title,
    btnTxtSearch,
    btnTxtClear,
    resetFilters,
    handleFilterPipeline,
  } = props;

  const renderComponents = (name: string) => {
    switch (name) {
        case locale.getString('global.qualityScore'):
            return <RenderQualityDropDown />;

        case locale.getString('global.feedback'):
            return <RenderFeedbackFilter />;

        case locale.getString('global.date'):
            return <RenderDateFilter />;

      //   case locale.getString('global.assetType'):
      //     return <RenderAssetTypeFilter />;

      //   case locale.getString('global.assetVariant'):
      //     return <RenderAssetVariantFilter />;

        default:
            break;
    }
  };
  const resetFiltersAndValues = () => {
    resetFilters();
  };

  return (
    <Drawer anchor="right" open={drawerState} onClose={toggleState}>
      <SearchHeader>
        <Typography variant="h4">{title}</Typography>
        <Box onClick={toggleState} sx={{ '&:hover': { cursor: 'pointer' } }}>
          <CloseIcon color="primary" />
        </Box>
      </SearchHeader>
      {searchTerms.map((term, i) => (
        <Accordion key={`search-filter-${term}-${i}`} disableGutters={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id={`filter-header-${term}`}
          >
            {/* <Typography variant="h4" m={0}> */}
            {term}
            {/* </Typography> */}
          </AccordionSummary>
          <AccordionDetails>{renderComponents(term)}</AccordionDetails>
        </Accordion>
      ))}
      <SearchFooter>
        <Button color="cancel" sx={{ mr: 1 }} onClick={resetFiltersAndValues}>
          {btnTxtClear}
        </Button>
        <Button sx={{ mr: 1 }} onClick={handleFilterPipeline}>
          {btnTxtSearch}
        </Button>
      </SearchFooter>
    </Drawer>
  );
};

export default observer(SearchFilter);
