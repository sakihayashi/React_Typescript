import React from 'react';

import { observer } from 'mobx-react-lite';
import { TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Box140, FlexBoxBaseline } from '@otosense/components';

import { useRootContext } from '../../../../RootStore';
import { TabIndex } from '../../../DataCollectionAndAnalysis/store';

import SensorConditions from '../../../components/SensorConditions';

import { TableCellNoBorder, TableInGrid } from '../RecordingPlc/components/styles';

const RecordingDetails = () => {
  const root = useRootContext();
  const appState = root.appState;
  const dataCollectionStore = root.dataCollectionStore;
  const locale = root.appState.locale;
  const currentData = dataCollectionStore.openedTabs[dataCollectionStore.activeTab -1];
  let sessionNum: TabIndex;
  if (!!currentData){
    sessionNum = dataCollectionStore.openedTabIndex.find(data => data.id === currentData._id);
  }
  return (
    <TableInGrid>
      <TableHead>
        <TableRow sx={{borderBottom: '1px solid lightgrey'}}>
          <TableCell>
            <Typography variant="subtitle1" color="inherit">
              {locale.getString('testing.recordingDetails')}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCellNoBorder>
            {currentData &&
                <>
                  {dataCollectionStore.isPlc &&
                  <FlexBoxBaseline>
                    <Box140>{locale.getString('global.variant')}</Box140> :
                    <Typography variant="h4" ml={0.5}>{currentData.asset_variant}</Typography>
                  </FlexBoxBaseline>
                  }
                  <FlexBoxBaseline>
                    <Box140>
                      {currentData.rdy && currentData.rdy.name ?
                        currentData.rdy.name
                        :
                        `${locale.getString('testing.sessionNum')}`
                      }
                    </Box140> :
                    <Typography variant="h4" ml={0.5}>{currentData.rdy && currentData.rdy.name ? currentData.rdy.value + '' : sessionNum.index}</Typography>
                  </FlexBoxBaseline>
                  <FlexBoxBaseline>
                    <Box140 sx={{textTransform: 'none'}}>{locale.getString('global.dateAndTime')}</Box140> :
                    <Typography variant="h4" ml={0.5}>{appState.formatSessionTime(currentData.bt)}</Typography>
                  </FlexBoxBaseline>
                  {currentData.sensors?.length ?
                    <SensorConditions sensors={currentData.sensors}/>
                    :
                    <Typography variant="h4">{locale.getString('testing.noData')}</Typography>
                  }
                </>
            }
          </TableCellNoBorder>
        </TableRow>
      </TableBody>
    </TableInGrid>
  );
};

export default observer(RecordingDetails);
