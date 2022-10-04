import React from 'react';

import { observer } from 'mobx-react-lite';
import { TableCell, TableRow, Typography } from '@mui/material';

import { IResultsData } from '../../../../api';
import { useRootContext } from '../../../../RootStore';

import UploadedFeedback from 'Views/DataCollectionAndAnalysis/screens/components/UploadedFeedback';
import SensorConditionSm from './SensorConditionSm';

import { failTextS, passTextS } from '../../../../globalStyles/texts';
import { diagnosisCell } from '../../components/styles';

interface IProps {
  data: IResultsData;
  sessionNum: number;
}

const BottomLatestSessionsRow = (props: IProps) => {
  const { data, sessionNum } = props;
  const root = useRootContext();
  const dataCollectionStore = root.dataCollectionStore;
  const appState = root.appState;
  const locale = root.appState.locale;

  const createNewTab = () => {
    dataCollectionStore.setTabIndex({index: sessionNum, id: data._id});
    dataCollectionStore.setOpenedTabs(data);
    dataCollectionStore.setTabHeads(data.rdy && data.rdy.value ? data.rdy.value + '' : `# ${sessionNum}`);
  };
  const openFeedback = () => {
    dataCollectionStore.setTabIndex({index: sessionNum, id: data._id});
    dataCollectionStore.toggleAddFeedback();
    dataCollectionStore.setOpenedTabs(data);
    dataCollectionStore.setTabHeads(data.rdy && data.rdy.value ? data.rdy.value + '' : `# ${sessionNum}`);
  };
  return (
    <TableRow key={`data-${data._id}-${sessionNum}`} sx={{borderBottom: '1px solid lightgray'}} hover>
      <TableCell>
        <Typography variant="link" onClick={createNewTab} >
          {data.rdy.value ? data.rdy.value + '' : sessionNum}
        </Typography>
      </TableCell>
      <TableCell>
        {!!data.bt &&
          appState.formatSessionTime(data.bt)}
      </TableCell>
      <TableCell>
        {!!data.sensors?.length ?
          <SensorConditionSm sensors={data.sensors}/>
          :
          locale.getString('testing.noData')
        }
      </TableCell>
      <TableCell>
        {typeof data.quality_score === 'number' ?
          data.quality_score.toFixed(1)
          :
          [data.quality_score || '']
        }
      </TableCell>
      <TableCell>
        {typeof data.quality_score === 'number' && data.quality_score >= 5 ? passTextS() : failTextS()}
      </TableCell>
      <TableCell sx={diagnosisCell} >
        {!!data.ai_msgs?.length && locale.getString(data.ai_msgs[0].message)}
      </TableCell>
      <TableCell sx={{'::first-letter': {textTransform: 'uppercase'}}}>
        {data && data.notes || !!data.feedback ?
          <UploadedFeedback data={data} openEdit={openFeedback}/>
          :
          <Typography variant="link" onClick={openFeedback} sx={{whiteSpace: 'nowrap'}}>{locale.getString('reviewSessions.addFeedback')}
          </Typography>
        }
      </TableCell>
    </TableRow>
  );
};

export default observer(BottomLatestSessionsRow);
