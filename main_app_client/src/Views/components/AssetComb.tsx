import React from 'react';

import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';

import { HeaderStyle, HeaderTextWrapper, HeaderTitle } from './styles';

const AssetCombo = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const headers = [
    'global.assetType',
    'global.variant',
    'global.pipeline',
  ];
  const contents = [
    assetTypeStore.selectedAssetType
      ? assetTypeStore.selectedAssetType.name
      : '',
    assetTypeStore.selectedVariant ? assetTypeStore.selectedVariant._id : '',
    assetTypeStore.selectedChannel ? assetTypeStore.selectedChannel.name : '',
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
export default observer(AssetCombo);
