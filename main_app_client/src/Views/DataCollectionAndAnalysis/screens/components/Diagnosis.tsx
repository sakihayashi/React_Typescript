import React from 'react';

import { observer } from 'mobx-react-lite';
import { TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { ErrorText, FlexBox, SuccessText } from '@otosense/components';

import { useRootContext } from '../../../../RootStore';

import DiagnosisDetailsSection from '../../../components/DiagnosisDetailsSection';
import { TableCellNoBorder, TableInGrid, TitleBox70 } from '../RecordingPlc/components/styles';

const Diagnosis = () => {
  const root = useRootContext();
  const dataCollectionStore = root.dataCollectionStore;
  const locale = root.appState.locale;
  const currentData = dataCollectionStore.openedTabs[dataCollectionStore.activeTab -1];
  const threshold = currentData ? currentData.threshold : 5;
  const successText = (
    <Typography variant="h4" component="span" sx={SuccessText} ml={0.5}>{locale.getString('reviewSessions.pass')}</Typography>
  );
  const errorText = (
    <Typography variant="h4" component="span" sx={ErrorText} ml={0.5}>{locale.getString('reviewSessions.fail')}</Typography>
  );
  return (
    <TableInGrid>
      <TableHead>
        <TableRow>
          <TableCell sx={{backgroundColor: 'transparent'}}>
            <Typography variant="subtitle1" color="inherit">{locale.getString('testing.diagnosis')}</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCellNoBorder>
            {!!currentData &&
                <>
                  <FlexBox>
                    <TitleBox70 variant="subtitle1">{locale.getString('global.score')}</TitleBox70>:
                    <Typography variant="h4" component="span" ml={0.5}>
                      {typeof currentData.quality_score === 'number' ? currentData.quality_score.toFixed(1) : currentData.quality_score
                      }
                    </Typography>
                  </FlexBox>
                  <FlexBox>
                    <TitleBox70 variant="subtitle1">{locale.getString('testing.result')}</TitleBox70>: {' '}
                    {typeof currentData.quality_score === 'number' && currentData.quality_score >= threshold ?
                      successText : errorText
                    }
                  </FlexBox>
                  <FlexBox>
                    <TitleBox70 variant="subtitle1">{locale.getString('literals.details')}</TitleBox70>:
                    <Typography variant="h4" component="span">
                      <DiagnosisDetailsSection data={currentData}/>
                    </Typography>
                  </FlexBox>
                </>
            }
          </TableCellNoBorder>
        </TableRow>
      </TableBody>
    </TableInGrid>
  );
};

export default observer(Diagnosis);
