import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DppWizardStore } from '.';
import { useRootContext } from '../../App';
import AppState from '../../appState';
import { RenderFunction } from '../../Utility/types';

const ChunkScoreAggResults = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  if (!dppWizardStore.trainingResults) {
    return null;
  }

  const { locale } = appState;
  const sessionNumbers = Array.from(
    { length: dppWizardStore.trainingSessionMap.length },
    (_, i) => i + 1,
  );
  const phaseData =
    dppWizardStore.trainingResults.chunk_score_aggregate[
      dppWizardStore.selectedTrainingSessionId
    ];
  const phaseNames = Object.keys(phaseData);
  const channelNames = Object.keys(phaseData[phaseNames[0]]);

  const renderTable: RenderFunction = () => {
    const tableRows: JSX.Element[] = Object.entries(phaseData).map(([phase, channelData], index) => {
      const phaseNumber = index + 1;
      return (
        <TableRow key={`chunk-score-agg-${phaseNumber}`}>
          <TableCell>
            {`${locale.getString('literals.phase')} ${phaseNumber}`}
          </TableCell>
          {Object.entries(channelData).map(([channel, num], i) => (
            <TableCell key={`child-score-agg-${i}`}>{num}</TableCell>
          ))}
        </TableRow>
      )
    }
    );

    return (
      <TableContainer>
        <Table className="oto-wizard__table oto-bg-white">
          <TableHead className="oto-wizard__table--header">
            <TableRow>
              <TableCell>{locale.getString('wizard.phaseNum')}</TableCell>
              {channelNames.map((channel, index) => {
                return (
                  <TableCell key={`analog-input-num-${index}`}>
                    {`${locale.getString('literals.channel')} ${channel}`}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody className="oto-wizard__table--body">{tableRows}</TableBody>
        </Table>
      </TableContainer>
    );
  };
  return (
    <div className="oto-drawer__datavis-container">
      <div className="oto-dropdown__container">
        <div className="oto-dropdown__group oto-flex-box">
          <div>
            <div className="oto-dropdown__label">
              {locale.getString('wizard.testSessionN')}
            </div>
            <FormControl>
              <Select
                // options={sessionNumbers}
                value={(
                  dppWizardStore.selectedTrainingSessionIdx + 1
                ).toString()}
                onChange={(e: SelectChangeEvent) =>
                  (dppWizardStore.selectedTrainingSessionIdx =
                    +e.target.value - 1)
                }
                size="small"
              >
                {sessionNumbers.map((num, i) => (
                  <MenuItem key={`session-num-${num}-${i}`} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <span className="oto-dropdown__unit oto-spacer--mt-10px oto-spacer--ml-1_25rem">
            {locale.getString('literals.of')} {sessionNumbers.length}
          </span>
        </div>
      </div>
      <div>{renderTable()}</div>
    </div>
  );
};

export default observer(ChunkScoreAggResults);
