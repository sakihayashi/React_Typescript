import React from 'react';

import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';
import { FlexBox, NoMaxWidthTooltip, TextIconBox } from '@otosense/components';
import SignalCellularConnectedNoInternet4BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet4Bar';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularOffIcon from '@mui/icons-material/SignalCellularOff';
import InfoIcon from '@mui/icons-material/Info';

import { SensorCondition, SensorStatus } from '../../../../api';
import { useRootContext } from '../../../../RootStore';
import SeeAllSensors from './SeeAllSensors';

import { iconS } from '../styles';

interface IProps {
  sensors: SensorCondition[];
  isText?: boolean;
}

const SensorConditionSm = (props: IProps) => {
  const root = useRootContext();
  const locale = root.appState.locale;
  const nums = !!props.sensors?.length && props.sensors.map((sensor) => sensor.status);
  let max: number = null;
  if (nums){
    max = Math.max(...nums);
  }
  let signal: JSX.Element;
  if (max || max === 0){
    switch (max) {
    case SensorStatus.OK:
      signal = <SignalCellularAltIcon sx={iconS} color="success" />;
      break;
    case SensorStatus.WEAK:
      signal = <SignalCellularConnectedNoInternet4BarIcon sx={iconS} color="warning" />;
      break;
    case SensorStatus.ERROR:
      signal = <SignalCellularOffIcon sx={iconS} color="error" />;
      break;
    }
  }

  return (
    <FlexBox>
      {signal && signal}
      <NoMaxWidthTooltip title={<SeeAllSensors sensors={props.sensors ? props.sensors : []}/>} placement="bottom-start" arrow sx={{minWidth: 'max-content'}}>
        <TextIconBox
          sx={{marginLeft: 0.5}}
        >
          {props.isText &&
          <Typography variant="link" >
            {locale.getString('testing.seeAll')}
          </Typography>
          }
          <InfoIcon color="primary" sx={iconS}/>
        </TextIconBox>
      </NoMaxWidthTooltip>
    </FlexBox>
  );
};

export default observer(SensorConditionSm);
