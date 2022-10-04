import React, { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Tooltip, Typography } from '@mui/material';
import { FlexBox, TextIconBox } from '@otosense/components';
import SignalCellularConnectedNoInternet4BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet4Bar';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularOffIcon from '@mui/icons-material/SignalCellularOff';
import InfoIcon from '@mui/icons-material/Info';

import { SensorCondition, SensorStatus } from '../../../../api';
import { useRootContext } from '../../../../RootStore';
import SeeAllSensors from './SeeAllSensors';

import { iconS, iconXXL } from '../styles';

interface IProps {
  sensors: SensorCondition[];
  size?: string;
}

const SingleSensorCondition = (props: IProps) => {
  const { size } = props;
  const sensors = props.sensors;
  const root = useRootContext();
  const locale = root.appState.locale;
  const nums = sensors && sensors.map((sensor) => sensor.status);
  const max = Math.max(...nums);
  let signal: JSX.Element;
  const iconSize = size === 'sm' ? iconS : iconXXL;
  const [openAll, setOpenAll] = useState<boolean>(false);

  switch (max) {
  case SensorStatus.OK:
    signal = <SignalCellularAltIcon sx={iconSize} color="success" />;
    break;
  case SensorStatus.WEAK:
    signal = <SignalCellularConnectedNoInternet4BarIcon sx={iconSize} color="warning" />;
    break;
  case SensorStatus.ERROR:
    signal = <SignalCellularOffIcon sx={iconSize} color="error" />;
    break;
  }
  return (
    <FlexBox sx={{width: 'auto'}}>
      {signal}
      <Tooltip
        title={<SeeAllSensors sensors={!!sensors?.length ? sensors : []}/>}
        placement="bottom"
        arrow open={openAll}
        sx={{maxWidth: 'none', zIndex: 1000}}
      >
        <TextIconBox
          onMouseEnter={() => setOpenAll(true)}
          onMouseLeave={() => setOpenAll(false)}
          sx={{marginLeft: 0.5}}
        >
          <Typography color="primary" variant="link" >
            {locale.getString('testing.seeAll')}
          </Typography>
          <InfoIcon color="primary" sx={iconS}/>
        </TextIconBox>
      </Tooltip>
    </FlexBox>
  );
};

export default observer(SingleSensorCondition);
