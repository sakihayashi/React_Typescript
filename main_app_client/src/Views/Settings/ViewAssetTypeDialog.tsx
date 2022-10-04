import React, { useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
// import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore, { AssetType, QCChannel } from '../../assetTypeStore';
import SettingsStore from '../../settingsStore';
import { PromiseFunction } from '../../Utility/types';

import { VirtualInputContainer } from '@otosense/components';

import { FlexBox, FlexSpaceBet } from '../../globalStyles/otoBox';
import SaveCloseBtns from '../components/SaveCloseBtns';
import { ViewAssetList } from './styles';

interface IProps {
  onClose: VoidFunction;
}

const ViewAssetType = (props: IProps) => {
  const { onClose } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const settingsStore: SettingsStore = root.settingsStore;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const locale: LocaleStore = appState.locale;
  const selectedAssetType: AssetType = assetTypeStore.selectedAssetType;
  const [newVariantName, setNewVariantName] = useState<string>('');
  const [newChannelName, setNewChannelName] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(true);
  const inputIndex = [0, 1];
  const handleVariantNameChange: (e: any) => void = (e) => {
    setNewVariantName(e.target.value);
    // appState.resetMoveUpStyle(inputIndex[0]);
  };
  const handleChannelNameChange: (e: any) => void = (e) => {
    setNewChannelName(e.target.value);
    // appState.resetMoveUpStyle(inputIndex[1]);
  };
  const cancelAndClose = () => {
    settingsStore.resetDeviceSettings();
    onClose();
  };

  const createNewVariant: PromiseFunction = () => {
    const res = assetTypeStore.createNewVariant(newVariantName);
    if (res) {
      setNewVariantName('');
    }
    return res;
  };
  const createNewChannel: PromiseFunction = () => {
    const res = assetTypeStore.createNewChannel(newChannelName);
    if (res) {
      setNewChannelName('');
    }
    return res;
  };

  let variantName: string = '';
  if (assetTypeStore.selectedVariant) {
    variantName = `variant ${assetTypeStore.selectedVariant._id}`;
  }
  if (!selectedAssetType) {
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="dialog-title" />
    );
  }
  const goToNextScreen = () => {
    // assetTypeStore.setIsAllSelected();
    settingsStore.pipelineConfigOptions();
    settingsStore.nextEditConfig();
  };

  return (
    <Dialog
      id="dialog-search"
      open={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="dialog-title"
      maxWidth="md"
    >
      <DialogTitle id="dialog-title-view-asset">
        <Typography variant="h2" component="header">
          {locale.getString('settings.selectVariantPipeline')}
        </Typography>
        <Typography variant="subtitle1">
          {locale.getString('global.assetType')}  {' : '}
          <b>{selectedAssetType.name ? selectedAssetType.name : ''}</b>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <FlexSpaceBet>
          <Box sx={{ width: 250 }} mr={1}>
            <Typography
              variant="body1"
              mb={0.5}
              sx={{ minHeight: 36, '::first-letter': {textTransform: 'uppercase'} }}
              component="header"
            >
              {locale.getString('settings.variants')} {' : '}
              <b>
                {assetTypeStore.selectedVariant?._id &&
                  assetTypeStore.selectedVariant._id}
              </b>
            </Typography>
            <Box sx={{ width: '100%' }} pb={1}>
              <ViewAssetList>
                {!!assetTypeStore.selectedAssetType?.variants.length &&
                  assetTypeStore.selectedAssetType.variants.map(
                    (variant, index) => (
                      <ListItemButton
                        selected={
                          assetTypeStore.selectedVariant._id === variant._id || false
                        }
                        key={`variant-${variant._id}`}
                        onClick={() => assetTypeStore.selectVariant(variant)}
                      >
                        <ListItemText primary={variant && variant._id} />
                      </ListItemButton>
                    )
                  )}
              </ViewAssetList>
            </Box>
            <FlexBox>
              <VirtualInputContainer
                touchScreenMode={appState.touchScreenMode}
                moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[inputIndex[0]]}
                onClose={() => appState.resetMoveUpStyle(inputIndex[0])}
                text={locale.getString('literals.close')}
              >
                <TextField
                  variant="outlined"
                  label={locale.getString('settings.addNewVariant')}
                  onChange={handleVariantNameChange}
                  onFocus={() => appState.setMoveUpStyle(inputIndex[0])}
                  onBlur={handleVariantNameChange}
                  value={newVariantName}
                />
              </VirtualInputContainer>

              <Button disabled={!newVariantName} onClick={createNewVariant}>
                <Typography variant="button">
                  {locale.getString('literals.save')}
                </Typography>
              </Button>
            </FlexBox>
          </Box>
          <Box sx={{ width: 250 }}>
            <Typography
              variant="body1"
              mb={0.5}
              sx={{ minHeight: 36 }}
              component="header"
            >
              {locale.getFormattedString('settings.channelsForVariant', {
                variantName: ': ',
              })}
              <b>{variantName}</b>
            </Typography>
            <Box sx={{ width: '100%', pb: 1 }}>
              <ViewAssetList>
                {!!assetTypeStore.availableChannels?.length && assetTypeStore.availableChannels.map((channel: QCChannel) => {
                  return (
                    <ListItemButton
                      key={`channel-${channel._id}`}
                      selected={
                        assetTypeStore.selectedChannel?.name  ?
                          assetTypeStore.selectedChannel.name === channel.name
                          :
                          false
                      }
                      onClick={() => assetTypeStore.setChannel(channel)}
                    >
                      <ListItemText primary={channel.name && channel.name + ''} />
                    </ListItemButton>
                  );
                })}
              </ViewAssetList>
            </Box>
            {!!assetTypeStore.selectedVariant && (
              <FlexBox>
                <VirtualInputContainer
                  touchScreenMode={appState.touchScreenMode}
                  moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[inputIndex[1]]}
                  onClose={() => appState.resetMoveUpStyle(inputIndex[1])}
                  text={locale.getString('literals.close')}
                >
                  <TextField
                    variant="outlined"
                    label={locale.getString('settings.addNewChannel')}
                    onChange={handleChannelNameChange}
                    onFocus={() => appState.setMoveUpStyle(inputIndex[1])}
                    onBlur={handleChannelNameChange}
                    value={newChannelName}
                  />
                </VirtualInputContainer>
                <Button disabled={!newChannelName} onClick={createNewChannel}>
                  <Typography variant="button">
                    {locale.getString('literals.save')}
                  </Typography>
                </Button>
              </FlexBox>
            )}
          </Box>
        </FlexSpaceBet>
      </DialogContent>
      <DialogActions>
        <SaveCloseBtns
          closeFunc={cancelAndClose}
          saveFunc={goToNextScreen}
          saveDisabled={!(assetTypeStore.selectedChannel && assetTypeStore.selectedVariant)}
          isNext={true}
        />
      </DialogActions>
    </Dialog>
  );
};

export default observer(ViewAssetType);
