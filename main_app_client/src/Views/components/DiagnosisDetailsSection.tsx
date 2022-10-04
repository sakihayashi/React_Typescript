import React from 'react';

import {observer} from 'mobx-react-lite';
import {IResultsData, TestStatus} from '../../api';
import {useRootContext} from '../../RootStore';
import { Box } from '@mui/material';

import {UlNoM} from '../DataCollectionAndAnalysis/screens/RecordingPlc/components/styles';

interface IProps {
  data: IResultsData | TestStatus;
}

const DiagnosisDetailsSection = (props: IProps) => {
  const data = props.data;
  const root = useRootContext();
  const locale = root.appState.locale;
  return (
    <UlNoM sx={{paddingLeft: 0.5}}>
      {!!data.ai_msgs?.length && data.ai_msgs.map((ai, i) => {
        if (data.ai_msgs.length > 1) {
          return (
            <li key={`${ai.bt}-${i}`}>{locale.getString(ai.message)}</li>
          );
        } else if (data.ai_msgs.length === 1) {
          return (
            <Box key={`${ai.bt}-${i}`}>{locale.getString(ai.message)}</Box>
          );
        }
      })}
    </UlNoM>
  );
};

export default observer(DiagnosisDetailsSection);