import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { FeedbackEnum } from "../../api";
import { useRootContext } from "../../App";
import AppState from "../../appState";
import { RenderFunction } from "../../Utility/types";
import SearchFilter from "./SearchFilter";
import { DppSessionsStore, DppWizardStore } from ".";

const SelectSessions = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const dppSessionStore: DppSessionsStore = root.dppSessionStore;
  const locale: LocaleStore = appState.locale;
  const [drawerState, setDrawerState] = useState<boolean>(false);
  const filterTitle = locale.getString('filter.searchFilters');
  const textClear = locale.getString('literals.clear');
  const textSearch = locale.getString('literals.search');
  // const [visible, show, hide] = useToggle(false);
  // const [panels, onKeyDown] = usePanels({
  //   count: 3,
  //   idPrefix: 'simple-panels',
  // });
  const styleDiv = { width: '300px' };
  // const [panel1Props, panel2Props, panel3Props] = panels;
  // const panelProps = [panel1Props, panel2Props, panel3Props];
  const searchTerms = [
    locale.getString('global.date'),
    locale.getString('global.qualityScore'),
    locale.getString('global.feedback'),
  ];
  const [isAll, setIsAll] = useState<boolean>(false);
  const toggleState = () => {
    setDrawerState(!drawerState);
  };
  const checkIfSelected = () => {
    if (dppWizardStore.selectedSessions.length <= 0) {
      dppWizardStore.disableNextBtn();
    } else if (dppWizardStore.selectedSessions.length >= 1) {
      dppWizardStore.enableNextBtn();
    }
  };
  const rowClicked = (e: any, index: number) => {
    const tempArr: number[] = toJS(dppWizardStore.selectedSessions);
    const found = tempArr.includes(index);
    if (found) {
      const i = tempArr.indexOf(index);
      tempArr.splice(i, 1);
      dppWizardStore.setSelectedSessions(tempArr);
    } else {
      tempArr.push(index);
      const uniq = Array.from(new Set(tempArr));
      dppWizardStore.setSelectedSessions(uniq);
    }
    checkIfSelected();
  };

  const toggleAllSelected = () => {
    if (!isAll) {
      const tempArr = dppSessionStore.displayedSessions.map(
        (session, index) => index
      );
      dppWizardStore.setSelectedSessions(tempArr);
    } else {
      dppWizardStore.setSelectedSessions([]);
    }
    setIsAll(!isAll);
    checkIfSelected();
  };

  const renderTable: RenderFunction = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  dppWizardStore.selectedSessions.length > 0 &&
                    dppWizardStore.selectedSessions.length <
                      dppSessionStore.displayedSessions.length
                }
                checked={isAll}
                onChange={toggleAllSelected}
                inputProps={{
                  'aria-label': "select all sessions",
                }}
              />
            </TableCell>
            {/* <TableCheckbox
                id="selectable-sessions-row-header"
                {...rootProps}
                onClick={toggleAllSelected}
                className="oto-review__table--upload-all oto-table__checkbox-cell"
              /> */}
            {searchTerms.map((name, index) => (
                            <TableCell
                                key={`${name}-header-${index}`}
                                // grow={index === 0}
                                style={index === 0 ? styleDiv : {}}
                            >
                                {name}
                            </TableCell>
                        ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {dppSessionStore.displayedSessions.map((session, index) => {
            // const checkboxProps = getProps(session._id.toString());
            // const { checked, onChange } = checkboxProps;
            const feedback = session.feedback;
            return (
              <TableRow
                hover
                key={`id-${session._id}-${index}`}
                role="checkbox"
                selected={dppWizardStore.selectedSessions.includes(index)}
                onClick={(e) => rowClicked(e, index)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={dppWizardStore.selectedSessions.includes(index)}
                    inputProps={{
                      'aria-labelledby': session._id + index + "",
                    }}
                  />
                </TableCell>
                <TableCell>
                  {appState.formatSessionTime(+session.bt)}
                </TableCell>
                <TableCell>{session.quality_score}</TableCell>
                <TableCell>
                  {feedback === FeedbackEnum.PASS && (
                    <ThumbUpIcon color="success" />
                  )}
                  {feedback === FeedbackEnum.FAIL && (
                    <ThumbDownIcon color="error" />
                  )}
                </TableCell>
                <TableCell>{session.notes}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  useEffect(() => {
    appState.setIsLoading(true);
    Promise.all([
      dppWizardStore.handleFilterPipeline(),
      dppWizardStore.selectAssetApi(),
    ]).then((res) => {
      appState.setIsLoading(false);
    });
    dppWizardStore.disableNextBtn();
    document.title = locale.getString('titles.buildDppSelectSessions');
  }, []);

  return (
    <main className="oto-wizard_nopadding">
      <div className="oto-wizard__table--search-bar">
        <div className="oto-text-flex">
          <h2 className="oto-text_h2">
            {locale.getString('wizard.selectSessions')}
          </h2>
        </div>
        <div className="oto-wizard--header--right">
          <b>
            {dppWizardStore.totalFilteredSessions !== 0
              ? dppWizardStore.totalFilteredSessions
              : dppSessionStore.displayedSessions.length}
          </b>
          <span className="oto-spacer--mr-2rem">
            {' '}
            {locale.getString('wizard.sessions')}
          </span>
          <Button onClick={toggleState} color="secondary">
            <TuneIcon sx={{ mr: 0.5 }} />
            {locale.getString('global.searchFilter')}
          </Button>
        </div>
      </div>
      {renderTable()}
      <SearchFilter
        searchTerms={searchTerms}
        drawerState={drawerState}
        toggleState={toggleState}
        title={filterTitle}
        btnTxtSearch={textSearch}
        btnTxtClear={textClear}
        resetFilters={dppWizardStore.resetFilter}
        handleFilterPipeline={dppWizardStore.handleFilterPipeline}
      />

    </main>
  );
};

export default observer(SelectSessions);
