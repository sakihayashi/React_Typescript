import React from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Stack, Typography } from '@mui/material';
import { FlexBox } from '@otosense/components';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularConnectedNoInternet4BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet4Bar';
import SignalCellularOffIcon from '@mui/icons-material/SignalCellularOff';

import { SensorCondition } from '../../api';
import { useRootContext } from '../../RootStore';

interface IProps {
  sensors: SensorCondition[];
}

const SensorsDataList = (props: IProps) => {
  const root = useRootContext();
  const locale = root.appState.locale;
  return (
    <Stack mt={'5px'} ml={0}>
      {!!props.sensors?.length && props.sensors.map((sensor, i) => {
        let icon: JSX.Element;
        switch (sensor.status) {
        case 0:
          icon = <SignalCellularAltIcon color="success" key={`icon-success-${i}`}/>;
          break;
        case 1:
          icon = <SignalCellularConnectedNoInternet4BarIcon color="warning"key={`icon-warning-${i}`}/>;
          break;
        case 2:
          icon = <SignalCellularOffIcon color="error" key={`icon-error-${i}`}/>;
          break;
        }
        return (
          <FlexBox key={`sensor-id-${sensor.channel_id}`} ml={1}>
            <Typography variant="h4">{sensor.channel_id}-</Typography>
            <Typography variant="h4" mr={0.5}>{sensor.channel_name}</Typography>
            {icon}
            <Typography variant="h4" ml={0.5}>{locale.getString(sensor.message)}</Typography>
          </FlexBox>
        );
      })}
      {!props.sensors?.length && <Box>{locale.getString('testing.recordingMessage.noSensor')}</Box>}
    </Stack>
  );
};

export default observer(SensorsDataList);
