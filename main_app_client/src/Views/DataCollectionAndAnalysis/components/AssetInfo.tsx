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
// import { toJS } from 'mobx';

interface IProps {
  renderResults: IResultsData;
}

const AssetInfo = (props: IProps) => {
  const { renderResults } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  // const playbackStore = root.playbackStore;
  const selectedType = assetTypeStore.assetTypes.find(
    (type) => type.name === renderResults.asset_type
  );
  const selectedVariant = selectedType.variants.find(
    (variant) => variant._id === renderResults.asset_variant
  );
  const selectedPipeline = selectedVariant.channels.find(
    (pipeline) => pipeline._id === renderResults.channel_id
  );
  const headers = [
    'global.assetType',
    'global.variant',
    'global.pipeline',
  ];
  const contents = [
    // appState.formatSessionTime(renderResults.bt),
    renderResults.asset_type,
    renderResults.asset_variant,
    selectedPipeline.name,
    // playbackStore.playbackIndex + '',
  ];
  return (
    <>
      {headers.map((header, i) => {
        return (
          <HeaderTextWrapper key={`asset-info-${header}-${i}`}>
            <HeaderTitle>{locale.getString(header)}:</HeaderTitle>
            <HeaderStyle>{contents[i]}</HeaderStyle>
          </HeaderTextWrapper>
        );
      })}
    </>
  );
};
export default observer(AssetInfo);
