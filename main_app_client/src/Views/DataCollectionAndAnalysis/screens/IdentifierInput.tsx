import React, { ChangeEvent, useEffect } from 'react';

import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import apiRequest, { APIS } from '../../../api';
import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';
import AssetTypeStore from '../../../assetTypeStore';
import { ReviewSessionsStore } from '../../ReviewSessions';
import DataCollectionStore from '../store';

import { firstLetterStyle } from 'globalStyles/texts';

export const bugFixOverline = {
  textTransform: 'none',
  '::first-letter':{
    textTransform: 'uppercase'
  }
};

const IdentifierInput = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const dataCollectionStore: DataCollectionStore = root.dataCollectionStore;
  const locale: LocaleStore = appState.locale;
  const headers = [
    locale.getString('global.assetType'),
    locale.getString('global.variant'),
    locale.getString('global.pipeline'),
  ];
  const options = [
    assetTypeStore.assetTypeNames,
    assetTypeStore.variantIds,
    assetTypeStore.variantChannelNames.map((data) => data.name),
  ];
  const autoSelect = locale.getString('testing.autoSelect');
  if (assetTypeStore.hasPlcConfig && !options[1].includes(autoSelect)){
    options[1].unshift(autoSelect);
  } else if (!assetTypeStore.hasPlcConfig) {
    const index = options[1].indexOf(autoSelect);
    options[1].slice(index, 1);
  }
  const values = [
    assetTypeStore.selectedAssetType
      ? (assetTypeStore.selectedAssetType.name as string)
      : '',
    !assetTypeStore.plcAutoSelect
      ? assetTypeStore.selectedVariant ? (assetTypeStore.selectedVariant._id as string) : ''
      : autoSelect,
    assetTypeStore.selectedChannel
      ? (assetTypeStore.selectedChannel.name as string)
      : '',
  ];

  useEffect(() => {
    document.title = locale.getString('titles.selectAssetType');
  });

  useEffect(() => {
    dataCollectionStore.setIsStopped(false);
    dataCollectionStore.setIsRecordingDone(false);
    // auto select asset used in latest session
    reviewSessionsStore
      .filteredSessions(null, null, null, null, null, null, null, 1, null)
      .then(([[latestResult]]) => {
        if (latestResult == null) {
          return;
        }
        if (assetTypeStore.assetTypes) {
          const latestAssetType = assetTypeStore.assetTypes.find(
            (assetType) => assetType.name === latestResult.asset_type
          );
          if (latestAssetType) {
            assetTypeStore.selectAssetTypeById(latestAssetType._id);
          }
        }

        assetTypeStore.selectVariantById(latestResult.asset_variant);

        if (
          assetTypeStore.selectedVariant &&
          assetTypeStore.selectedVariant.channels
        ) {
          const latestChannel = assetTypeStore.selectedVariant.channels.find(
            (channel) => channel._id === latestResult.channel_id
          );
          if (latestChannel) {
            assetTypeStore.selectChannelByName(latestChannel.name);
          }
        }
      });
  }, []);

  const nextScreen: VoidFunction = () => {
    dataCollectionStore.resetRecordingData();
    const pipeline = assetTypeStore.selectedChannel;
    if (!assetTypeStore.ready && !assetTypeStore.plcAutoSelect) {
      return;
    }
    appState.setIsLoading(true);
    assetTypeStore.setInstanceName('' + Date.now());
    if (assetTypeStore.plcAutoSelect){
      appState.setIsLoading(false);
      dataCollectionStore.setScreenPlcRecording();
    } else if (pipeline.definition.source_configs && pipeline.definition.source_configs.find((config) => config.hasOwnProperty('plc_cfg'))) {
      appState.setIsLoading(false);
      dataCollectionStore.setScreenPlcRecording();
    }
    return apiRequest(APIS.START_TESTING, {
      inputs: {
        asset_type: assetTypeStore.selectedAssetType.name,
        asset_variant: assetTypeStore.selectedVariant._id,
        channel: assetTypeStore.selectedChannel._id,
        instance: assetTypeStore.instanceName,
        pipeline_id: assetTypeStore.selectedChannel.dpp_id,
      },
      user_session_id: appState.userSession?.user_session_id
    });

  };

  const selectAssetType = (e: ChangeEvent<HTMLTextAreaElement>) => {
    assetTypeStore.selectAssetTypeByName(e.target.value as string, true);
  };

  const selectVariant = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === autoSelect && assetTypeStore.plcAutoSelect === false){
      assetTypeStore.setPlcAutoSelect(true);
    } else if (e.target.value !== autoSelect && assetTypeStore.plcAutoSelect){
      assetTypeStore.setPlcAutoSelect(false);
      assetTypeStore.selectVariantById(e.target.value as string, true);
    } else if (e.target.value !== autoSelect && !assetTypeStore.plcAutoSelect){
      assetTypeStore.selectVariantById(e.target.value as string, true);
    }
  };

  const selectChannel = (e: ChangeEvent<HTMLTextAreaElement>) => {
    assetTypeStore.selectChannelByName(e.target.value as string);
  };

  const handleChanges = [selectAssetType, selectVariant, selectChannel];
  const refreshAssetTypes = () => {
    return assetTypeStore.fetchAssetTypes();
  };
  useEffect(() => {
    const timerId = setInterval(refreshAssetTypes, 2000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <>
      <Grid container spacing={1}>
        {headers.map((header, i) => {
          let helperText: string = null;
          if (i === 2 && values[i]) {
            // selecting for pipeline
            const channelData = assetTypeStore.variantChannelNames.find(
              (data) => data.name === values[i]
            );
            if (channelData && channelData.dpp_id) {
              // display dppUpdated time
              helperText = `${locale.getString(
                'testing.dppUpdated'
              )}: ${appState.formatSessionTime(channelData.dpp_build_time)}`;
              assetTypeStore.setSelectedDppBuiltTime(
                channelData.dpp_build_time
              );
              dataCollectionStore.setIsDpp(true);
            } else {
              // display dataAcquisitionOnly
              helperText = locale.getString('testing.dataAcquisitionOnly');
              dataCollectionStore.setIsDpp(false);
              assetTypeStore.setSelectedDppBuiltTime(null);
            }
          }
          return (
            <Grid item xs={4} key={`form-identifier-input-${header}-${i}`}>
              <FormControl sx={{ minWidth: '100%', height: 'auto' }} fullWidth={true}>
                {i === 2 && assetTypeStore.plcAutoSelect ?
                  <Box/>
                  :
                  <>
                    <Typography variant="overline" sx={bugFixOverline}>{header}</Typography>
                    {!!options.length &&
                    <TextField
                      select
                      value={values[i]}
                      onChange={handleChanges[i]}
                      helperText={helperText}
                    >
                      {options[i] &&
                        options[i].map((name, j) => {
                          return (
                            <MenuItem
                              key={`assettype-option-${name}-${j}`}
                              value={name}
                            >
                              {name}
                            </MenuItem>
                          );
                        })
                      }
                    </TextField>
                    }
                  </>
                }
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
      <Button
        size="large"
        sx={{ mt: 2, float: 'right' }}
        onClick={nextScreen}
        disabled={assetTypeStore.plcAutoSelect ? false: !assetTypeStore.ready}
      >
        <Box sx={firstLetterStyle}>
          {locale.getString('testing.start')}
        </Box>
      </Button>
    </>
  );
};

export default observer(IdentifierInput);
