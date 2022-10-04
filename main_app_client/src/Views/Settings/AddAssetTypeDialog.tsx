import React, { ChangeEvent, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { VirtualInputContainer } from '@otosense/components';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';

import { FormBox } from '../../globalStyles/otoBox';
import SettingsStore, { EditConfigViews } from '../../settingsStore';

interface IProps {
  disabled?: boolean;
  onClose: VoidFunction;
  openDeviceConfig: VoidFunction;
}

interface AssetNames {
  type: string;
  variant: string;
  pipeline: string;
}

const AddAssetTypeDialog = (props: IProps) => {
  const rootStore = useRootContext();
  const appState: AppState = rootStore.appState;
  const assetTypeStore: AssetTypeStore = rootStore.assetTypeStore;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = rootStore.settingsStore;
  const [asset, setAsset] = useState<AssetNames>({
    type: '',
    variant: '',
    pipeline: '',
  });
  const inputIndex = 0;

  const headers = [
    locale.getString('settings.enterAssetType'),
    locale.getString('settings.enterAssetVariant'),
    locale.getString('settings.enterAssetPipeline'),
  ];
  const labels = [
    locale.getString('global.assetType'),
    locale.getString('global.variant'),
    locale.getString('global.pipeline'),
  ];
  const names = ['type', 'variant', 'pipeline'];

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, i?: number) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const saveAsset: () => Promise<void> = () => {
    if (!asset.type || !asset.variant || !asset.pipeline) {
      appState.toastStore.addToast({
        severity: 'error',
        duration: 5000,
        message: locale.getString('general.pleaseFillForm'),
      });
      return Promise.resolve();
    }
    return assetTypeStore
      .createAssetTypeVariantAndPipeline(
        asset.type,
        asset.variant,
        asset.pipeline
      )
      .then((res: any) => {
        if (res !== 'error') {
          return settingsStore
            .pipelineConfigOptions()
            .then(() => {
              settingsStore.setEditConfigIndex(EditConfigViews.DEVICE_CONFIG);
              props.onClose();
              props.openDeviceConfig();
            });
        } else {
          resetNames();
          console.log('error and toast not working');
        }
      });
    // .then(() => {
    //   settingsStore.setEditConfigIndex(EditConfigViews.DEVICE_CONFIG);
    //   props.onClose();
    //   props.openDeviceConfig();
    // })
    // .then(() => resetNames());
  };

  const resetNames = () => {
    setAsset({ type: '', variant: '', pipeline: '' });
  };
  const cancelAndClose = () => {
    props.onClose();
    assetTypeStore.resetSelected();
    resetNames();
  };

  return (
    <Dialog id="dialog-add-asset" onClose={props.onClose} open={true}>
      <DialogTitle>{locale.getString('settings.addAssetType')}</DialogTitle>
      <DialogContent>
        {headers.map((header, i) => {
          return (
            <FormBox key={`add-asset-input-${header}-${i}`} mt={1}>
              <Typography variant="overline">{labels[i]}</Typography>
              { i === 2 ?
                <VirtualInputContainer
                  touchScreenMode={appState.touchScreenMode}
                  moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[inputIndex]}
                  onClose={() => appState.resetMoveUpStyle(inputIndex)}
                  text={locale.getString('literals.close')}
                >
                  <TextField
                    id={`${names[i]}-add-asset`}
                    name={names[i]}
                    onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e, i)}
                    onFocus={() => appState.setMoveUpStyle(inputIndex)}
                    onBlur={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e, i)}
                    placeholder={header}
                    value={asset[names[i]]}
                    sx={{ mr: 0 }}
                  />
                </VirtualInputContainer>
                :
                <TextField
                  id={`${names[i]}-add-asset`}
                  name={names[i]}
                  onChange={onChange}
                  placeholder={header}
                  value={asset[names[i]]}
                  sx={{ mr: 0 }}
                />
              }

            </FormBox>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button color="cancel" sx={{ mr: 1 }} onClick={cancelAndClose}>
          <Typography variant="button">
            {locale.getString('literals.close')}
          </Typography>
        </Button>
        <Button disabled={appState.isLoading} onClick={saveAsset}>
          <Typography variant="button">
            {locale.getString('literals.save')}
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(AddAssetTypeDialog);
