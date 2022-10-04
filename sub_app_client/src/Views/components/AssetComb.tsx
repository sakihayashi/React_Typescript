// import { styled } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { RootStoreContext } from '../../App';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';
import { HeaderStyle, HeaderTextWrapper, HeaderTitle } from './styles';

// export const HeaderTextWrapper = styled(Typography)({
//   fontSize: '18px',
//   lineHeight: '18px',
//   display: 'block',
//   marginBottom: 8,
// });
// export const HeaderTitle = styled('span')({
//   width: 150,
//   display: 'inline-block',
// });
// export const HeaderStyle = styled('span')({
//   fontFamily: 'IBMPlexSans-SemiBold, sans-serif',
// });

const AssetCombo = () => {
  const root = useContext(RootStoreContext);
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const headers = [
    'global.assetType',
    'global.assetVariant',
    'global.assetChannel',
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
      {headers.map((header, i) => (
        <HeaderTextWrapper key={`asset-info-${header}-${i}`}>
          <HeaderTitle>{locale.getString(header)}:</HeaderTitle>
          <HeaderStyle>{contents[i]}</HeaderStyle>
        </HeaderTextWrapper>
      ))}
    </>
  );
};
export default observer(AssetCombo);
