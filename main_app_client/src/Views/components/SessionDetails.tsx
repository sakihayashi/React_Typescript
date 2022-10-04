import React from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Grid, Typography } from '@mui/material';

import LocaleStore from '@otosense/locale';
import { IResultsData  } from '../../api';
import { useRootContext } from '../../RootStore';

import { Box100, Box135, FlexBoxBaseline, semiBoldText } from '@otosense/components';

import SensorConditionSm from '../DataCollectionAndAnalysis/screens/components/SensorConditionSm';

interface IProps {
  data: IResultsData;
  fontSize: string;
  dpp?: boolean;
}

const SessionDetails = (props: IProps) => {
  const { data, fontSize } = props;
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const assetTypeStore = root.assetTypeStore;
  const appState = root.appState;
  const assetDetails = [
    'global.assetType',
    'global.variant',
    'global.pipeline',
  ];
  const sessionDetails = [
    'global.dateAndTime',
    'settings.sensors'
  ];
  const pipeline = assetTypeStore.assetTypes.find(type => type.name === data.asset_type).variants.find(variant => variant._id === data.asset_variant).channels.find(channel => channel._id === data.channel_id);
  const assetDetaillValues = [
    data.asset_type,
    data.asset_variant,
    pipeline.name,
  ];

  const sessionDetailsValues = [
    <Typography key="session-time" variant={fontSize === 'lg' ? 'h4' : 'h5'} ml={0.5} sx={{minWidth: 250}}>
      {data.bt ? appState.formatSessionTime(+data.bt) : ''}
    </Typography>,
    data.sensors?.length ? <SensorConditionSm key="session_sensor_condition" sensors={data.sensors} isText={true}/> : <div/>
  ];

  return (
    <Box sx={{pb: 0.4}}>
      <Grid container>
        <Grid item sm={6}>
          {assetDetails.map((name, i) => {
            return (
              <FlexBoxBaseline key={name}>
                <Box100>
                  <Typography variant={fontSize === 'lg' ? 'body2' : 'body1'}>
                    {locale.getString(name)}
                  </Typography>
                </Box100>
                   : <Typography variant={fontSize === 'lg' ? 'h4' : 'h5'} sx={semiBoldText} ml={0.5}>{assetDetaillValues[i]}</Typography>
              </FlexBoxBaseline>
            );
          })}
        </Grid>
        <Grid item sm={6}>
          {data.rdy?.name &&
          <FlexBoxBaseline>
            <Box135 sx={{display: 'inline-table'}}>
              <Typography variant={fontSize === 'lg' ? 'body2' : 'body1'} sx={{width: 'max-content'}}>{data.rdy.name}</Typography>
            </Box135>
            : {' '}
            <Typography variant={fontSize === 'lg' ? 'h4' : 'h5'} ml={0.5} sx={{minWidth: 200}}> {data.rdy.value + ''}</Typography>
          </FlexBoxBaseline>
          }
          {sessionDetails.map((name, i) => {
            return (
              <FlexBoxBaseline key={name} alignItems="center">
                <Box135>
                  <Typography
                    variant={fontSize === 'lg' ? 'body2' : 'body1'}
                    sx={{width: 'max-content', textTransform: 'none','::first-letter': {textTransform: 'uppercase'}}}
                  >
                    {locale.getString(name)}
                  </Typography>
                </Box135>
                : {' '}
                <Typography
                  variant={fontSize === 'lg' ? 'h4' : 'h5'}
                  component="span"
                  ml={0}
                  sx={{minWidth: 250}}
                >
                  {sessionDetailsValues[i]}
                </Typography>
              </FlexBoxBaseline>
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );
};

export default observer(SessionDetails);
