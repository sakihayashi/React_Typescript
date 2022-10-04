import React from 'react';

import { observer } from 'mobx-react-lite';
import { Stack, Typography } from '@mui/material';
import { Box140 } from '@otosense/components';

import { useRootContext } from '../../RootStore';
import { SensorCondition } from '../../api';
import SensorsDataList from './SensorsDataList';

interface IProps {
  sensors: SensorCondition[];
}

const SensorConditions = (props: IProps) => {
  const root = useRootContext();
  const locale = root.appState.locale;

  return (
    <Stack direction="row">
      <Box140>
        <Typography variant="subtitle1">
          {locale.getString('settings.sensors')}
        </Typography>
      </Box140> :
      <SensorsDataList sensors={props.sensors}/>
      {/* <Stack mt={'5px'} ml={1} sx={{overflow: 'scroll'}}>
        {props.sensors.map((sensor, i) => {
          let icon: JSX.Element;
          switch (sensor.status) {
          case SensorStatus.OK:
            icon = <SignalCellularAltIcon color="success" key={sensor.channel_id}/>;
            break;
          case SensorStatus.WEAK:
            icon = <SignalCellularConnectedNoInternet4BarIcon color="warning" key={sensor.channel_id} />;
            break;
          case SensorStatus.ERROR:
            icon = <SignalCellularOffIcon color="error" key={sensor.channel_id}/>;
            break;
          }
          return (
            <FlexBox key={sensor.channel_id}>
              <Typography variant="h4">{sensor.channel_id}-</Typography>
              <Typography variant="h4" mr={0.5}>{sensor.channel_name}</Typography>
              {icon}
            </FlexBox>
          );
        })}
      </Stack> */}
    </Stack>
  );
};

export default observer(SensorConditions);