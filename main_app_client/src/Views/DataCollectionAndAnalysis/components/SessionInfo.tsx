import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { IResultsData } from '../../../api';
import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';
import AssetTypeStore from '../../../assetTypeStore';
import {
  HeaderStyle,
  HeaderTextWrapper,
  HeaderTitle,
} from '../../components/styles';
import SensorConditions from '../../components/SensorConditions';
interface IProps {
  data: IResultsData;
}

const SessionInfo = (props: IProps) => {
  const { data } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const playbackStore = root.playbackStore;
  const selectedType = assetTypeStore.assetTypes.find(
    (type) => type.name === data.asset_type
  );
  // const selectedVariant = selectedType.variants.find(
  //   (variant) => variant._id === data.asset_variant
  // );
  // const selectedPipeline = selectedVariant.channels.find(
  //   (pipeline) => pipeline._id === data.channel_id
  // );
  const recordingDetails = [
    locale.getString('testing.dateAndTime'),
    'user defined',
    locale.getString('settings.sensors'),
  ];
  const contents = [
    appState.formatSessionTime(data.bt),
    playbackStore.playbackIndex + '',
    'sensor values '
  ];
  return (
    <>
      {recordingDetails.map((header, i) => {
        return (
          <HeaderTextWrapper key={`asset-info-${header}-${i}`}>
            <HeaderTitle>{locale.getString(header)}</HeaderTitle>
            {i === 2 ?
              <SensorConditions sensors={data.sensors}/>
              :
              <HeaderStyle>{contents[i]}</HeaderStyle>
            }

          </HeaderTextWrapper>
        );
      })}
    </>
  );
};
export default observer(SessionInfo);
