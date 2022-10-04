import React from 'react';

import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { Box, Grid, SvgIconProps } from '@mui/material';
import {
  OtoComplete,
  OtoHilighted,
  OtoImcomplete,
  OtoStepCheck,
  OtoStepLine,
  OtoStepper,
  StepperIconStyle,
  StepperText
} from './styles';
import { SxProps } from '@mui/system';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import DataCollectionStore from 'Views/DataCollectionAndAnalysis/store';
import { useRootContext } from '../../../RootStore';
import { SystemStepIcon, SystemStepMessage } from '../../../api';

const ProgressStepper = () => {
  const root = useRootContext();
  const dcStore: DataCollectionStore = root.dataCollectionStore;
  const testStatus = dcStore.testStatus;
  const locale = root.appState.locale;
  const completeMsg = [
    'testing.recordingStatus.allDataAcquired',
    'testing.recordingStatus.allDataAnalyzed'
  ];

  const getStep = (msg: SystemStepMessage,  icon: SystemStepIcon, connectionLine: boolean, i: number) => {

    let iconComponent: React.ReactElement<SvgIconProps>;
    let stepClass: SxProps;
    if (dcStore.currentStep[i][1] === SystemStepIcon.empty) {
      iconComponent = <RadioButtonUncheckedIcon color="gray" sx={StepperIconStyle}/>;
      stepClass = OtoImcomplete;
    } else if (dcStore.currentStep[i][1] === SystemStepIcon.filled) {
      iconComponent = <Brightness1Icon color="accent" sx={StepperIconStyle} />;
      stepClass = OtoHilighted;
    } else if (dcStore.currentStep[i][1] === SystemStepIcon.checked) {
      iconComponent = <CheckCircleIcon color="success" sx={StepperIconStyle} />;
      stepClass = OtoComplete;
    } else if (dcStore.currentStep[i][1] === SystemStepIcon.warning){
      iconComponent = <ReportProblemIcon color="warning"/>;
      stepClass = OtoImcomplete;
    }

    return (
      <Grid item sx={stepClass as SxProps} key={`${msg}_${icon}-0${i}`} xs>
        <Box sx={OtoStepCheck}>
          {iconComponent}
          {!!connectionLine && (<Box sx={OtoStepLine} />)}
        </Box>
        <Box display="flex" sx={{whiteSpace: 'nowrap'}}>
          <StepperText variant="subtitle2">
            {locale.getString(dcStore.currentStep[i][0])}
          </StepperText>
        </Box>
      </Grid>
    );
  };
  return (
    <OtoStepper container>
      {!!testStatus?.system_progress?.length && !dcStore.testManuallyStopped && !!dcStore.currentStep.length ? testStatus.system_progress.map(([sysMsg, sysIcon], i) => {
        const includeConnectionLine = i < testStatus.system_progress.length - 1;
        return getStep(sysMsg, sysIcon, includeConnectionLine, i);
      })
        :
        completeMsg.map((msg, i) => {
          const lines = i === 0 ? true : false;
          return getStep(msg, SystemStepIcon.checked, lines, i);
        })
      }
    </OtoStepper>
  );
};

export default observer(ProgressStepper);
