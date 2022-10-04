import React, { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Accordion, AccordionDetails, AccordionSummary, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SignalCellularConnectedNoInternet4BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet4Bar';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularOffIcon from '@mui/icons-material/SignalCellularOff';
import LocaleStore from '@otosense/locale';
import { Box125, FlexBox, semiBoldText } from '@otosense/components';

import AppState from '../../../../appState';
import { useRootContext } from '../../../../RootStore';
import { SensorStatus } from '../../../../api';
import DataCollectionStore from 'Views/DataCollectionAndAnalysis/store';

import { iconS } from '../styles';
import { firstLetterStyle } from 'globalStyles/texts';

const SettingDetails = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const dataCollectionStore: DataCollectionStore = root.dataCollectionStore;
  const [expanded, setExpanded] = useState<boolean>(false);
  const assetDetails = [
    'global.assetType',
    'global.variant',
    'global.pipeline',
  ];
  const lastSession = dataCollectionStore.lastSession;
  const assetDetailsData = [
    lastSession?.asset_type || '',
    lastSession?.asset_variant || '',
    lastSession?.asset_channel || '',
  ];
  const channelHeads = [
    'settings.channel_ids',
    'settings.channel_name',
    'testing.status'
  ];

  const handleAccordion = () => {
    setExpanded(!expanded);
  };
  const sensorStatus = (status: SensorStatus) => {
    switch (status) {
    case SensorStatus.OK:
      return (<SignalCellularAltIcon sx={iconS} color="success" />);
    case SensorStatus.WEAK:
      return (<SignalCellularConnectedNoInternet4BarIcon sx={iconS} color="warning" />);
    case SensorStatus.ERROR:
      return (<SignalCellularOffIcon sx={iconS} color="error" />);
    default:
      break;
    }
  };
  const AssetDetailsTable =
  (<TableContainer sx={{pl: 0.5, pr: 0.5, pb: 0.5}}>
    <Table>
      <TableHead>
        <TableRow  sx={{borderBottom: '1px solid lightgrey'}}>
          <TableCell>{locale.getString('global.assetDetails')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell sx={firstLetterStyle}>
            {assetDetails.map((name, i) => {
              return (
                <FlexBox key={name}>
                  <Box125 sx={{marginRight: 0.5, textTransform: 'none'}}> {locale.getString(name)} </Box125>
                   :
                  <Box sx={semiBoldText}>{assetDetailsData[i]}</Box>
                </FlexBox>
              );
            })}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>);
  const sensorTable = (
    <TableContainer sx={{pl: 0.5, pr: 0.5, pb: 0.5}}>
      <Table>
        <TableHead>
          <TableRow  sx={{borderBottom: '1px solid lightgrey'}}>
            {channelHeads.map((head) => {
              return (
                <TableCell key={head}>{locale.getString(head)}</TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {!!dataCollectionStore.testStatus.sensors?.length && dataCollectionStore.testStatus.sensors.map((sensor) => {
            return (
              <TableRow key={sensor.channel_id} sx={{borderBottom: 'none'}}>
                <TableCell sx={{borderBottom: 'none', pt: 0, pb: 0}}>{sensor.channel_id}</TableCell>
                <TableCell sx={{borderBottom: 'none', pt: 0, pb: 0}}>{sensor.channel_name}</TableCell>
                <TableCell sx={{borderBottom: 'none', pt: 0, pb: 0}}>{sensorStatus(sensor.status)}</TableCell>
              </TableRow>

            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
  return (
    <Accordion expanded={expanded} onChange={handleAccordion} sx={{marginTop: '10px'}} elevation={0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />} sx={{background: '#fff'}}>
        <Typography variant="subtitle2">{locale.getString('testing.settingDetails')}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{borderTop: '1px solid #ddd'}}>
        <Box display="flex">
          {AssetDetailsTable}
          {sensorTable}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default observer(SettingDetails);
