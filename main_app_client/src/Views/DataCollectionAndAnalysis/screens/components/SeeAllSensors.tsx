import React from 'react';

import {observer} from 'mobx-react-lite';
import {Box, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularOffIcon from '@mui/icons-material/SignalCellularOff';
import SignalCellularConnectedNoInternet4BarIcon
  from '@mui/icons-material/SignalCellularConnectedNoInternet4Bar';

import {useRootContext} from '../../../../RootStore';
import {SensorCondition, SensorStatus} from '../../../../api';

import {iconS} from '../styles';

interface IProps {
  sensors: SensorCondition[];
}

const SeeAllSensors = (props: IProps) => {
  const root = useRootContext();
  const locale = root.appState.locale;
  const {sensors} = props;
  const heads = [
    'literals.id',
    'literals.name',
    'testing.status',
    'global.message'
  ];

  const sensorStatus = (status: SensorStatus) => {
    switch (status) {
    case SensorStatus.OK:
      return (<SignalCellularAltIcon sx={iconS} color="success"/>);
    case SensorStatus.WEAK:
      return (<SignalCellularConnectedNoInternet4BarIcon sx={iconS} color="warning"/>);
    case SensorStatus.ERROR:
      return (<SignalCellularOffIcon sx={iconS} color="error"/>);
    default:
      break;
    }
  };

  return (
    <Box sx={{background: '#fff', width: 'max-content'}}>
      <Table>
        <TableHead>
          <TableRow>
            {heads?.map((head, i) => {
              return (
                <TableCell
                  key={`head-${head}`}
                  sx={(i === 0) ? {textTransform: 'uppercase'} : null}
                >
                  {locale.getString(head)}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sensors?.map((sensor) => {
            return (
              <TableRow key={`content-${sensor.channel_id}`}>
                <TableCell>{sensor.channel_id}</TableCell>
                <TableCell sx={{whiteSpace: 'nowrap'}}>{sensor.channel_name}</TableCell>
                <TableCell>{sensorStatus(sensor.status)}</TableCell>
                <TableCell
                  sx={{whiteSpace: 'nowrap'}}>{locale.getString(sensor.message)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default observer(SeeAllSensors);
