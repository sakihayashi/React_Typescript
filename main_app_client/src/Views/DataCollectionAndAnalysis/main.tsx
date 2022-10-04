import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import { ThemeProvider} from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { otosenseTheme2022_recording } from '@otosense/components';

import { TestingViews } from '../../api';
import { useRootContext } from '../../RootStore';
import { RenderFunction } from '../../Utility/types';
import * as Screens from './screens';
import DataCollectionStore from './store';
import AppState, { View } from '../../appState';

import BackendFailedDialog from '../components/BackendFailedDialog';

import { ScreenMain } from './styles';

const DataCollection = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dataCollectionStore: DataCollectionStore = root.dataCollectionStore;
  const assetTypeStore = root.assetTypeStore;
  let currentScreen: TestingViews;

  const getRunningPipeline = () => {
    const data = dataCollectionStore.testStatus?.asset_data || null;

    if (!!data?.asset_type){
      const pipeline = assetTypeStore.assetTypes.find(type => type.name === data.asset_type).variants.find(variant => variant._id === data.asset_variant).channels.find(channel => channel._id === data.channel_id);
      return pipeline || null;
    }
  };

  const last20 = 'testing.last20Sessions';
  const renderContent: RenderFunction = () => {
    let screenComponent: JSX.Element;

    if (dataCollectionStore.screen !== currentScreen) {
      currentScreen = dataCollectionStore.screen;
    }
    if (dataCollectionStore.screen === TestingViews.ASSET_SELECTION) {
      screenComponent = <Screens.IdentifierInput />;
    } else if (dataCollectionStore.screen === TestingViews.RECORD_AND_TEST) {
      const pipeline = getRunningPipeline();
      let isPlcRunning: any;
      if (!!pipeline){
        isPlcRunning = pipeline?.definition?.source_configs?.find((config) => config.hasOwnProperty('plc_cfg'));
      }
      if (assetTypeStore.plcAutoSelect || !!isPlcRunning || dataCollectionStore.isPlc){
        screenComponent = <Screens.RecordingPlc />;
        dataCollectionStore.setIsPlc(true);
      } else if (assetTypeStore.selectedChannel?.definition?.source_configs && !!assetTypeStore.selectedChannel?.definition?.source_configs?.find((config) => config.hasOwnProperty('plc_cfg')) || !!isPlcRunning){
        screenComponent = <Screens.RecordingPlc />;
        dataCollectionStore.setIsPlc(true);
      } else if (!assetTypeStore.plcAutoSelect && !!assetTypeStore.selectedDppBuiltTime && !dataCollectionStore.isPlc) {
        screenComponent = <Screens.RecordingNonPlc />;
      } else {
        screenComponent = <Screens.RecordingOnly />;
      }
    } else {
      screenComponent = (
        <>
          {`Unhandled Screen: ${screen}`}
          <Button color="cancel" onClick={dataCollectionStore.prevScreen}>
            Go Back
          </Button>
          <Button onClick={dataCollectionStore.reset}>Return to Start</Button>
        </>
      );
    }
    return screenComponent;
  };

  useEffect(() => {
    assetTypeStore.fetchAssetTypes()
      .then(res => {
        const interval = setInterval(() => {
          if (appState.view === View.DATA_COLLECTION_AND_ANALYSIS){
            dataCollectionStore._updateTestStatus();
          }
          dataCollectionStore.setTestStatusIntervalId(interval);
        }, dataCollectionStore.testStatusSleepMilliseconds);
      });
    const copy = [...dataCollectionStore.tabHeads];
    copy[0] = last20;
    dataCollectionStore.replaceTabHeads(copy);
  }, []);

  return (
    <ThemeProvider theme={otosenseTheme2022_recording}>
      <ScreenMain>
        {renderContent()}
      </ScreenMain>
      {dataCollectionStore.isBackendFailed && <BackendFailedDialog/>}
    </ThemeProvider>
  );
};

export default observer(DataCollection);
