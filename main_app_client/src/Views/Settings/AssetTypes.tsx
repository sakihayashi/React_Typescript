import React, { useEffect, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { ScrollToTopBtn } from '@otosense/components';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore, { AssetType, AssetVariant } from '../../assetTypeStore';
import SettingsStore, { EditConfigViews } from '../../settingsStore';

import AddAssetTypeDialog from './AddAssetTypeDialog';
import ConfigEventHandlers from './ConfigEventHandlers';
import DeviceConfigDialog from './DeviceConfigDialog';
import SelectEventHandlers from './SelectEventHandlers';
import ViewAssetTypeDialog from './ViewAssetTypeDialog';

import { SubTitleBox } from './styles';

const AssetTypes = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const locale: LocaleStore = appState.locale;
  const [addAssetDialog, setAddAssetDialog] = useState<boolean>(false);
  const tableHeader = [
    locale.getString('global.assetType'),
    locale.getString('global.variant'),
    locale.getString('global.pipeline'),
    locale.getString('literals.details'),
  ];
  const settingsStore: SettingsStore = root.settingsStore;
  const [editConfig, setEditConfig] = useState<boolean>(false);

  const closeDialog = () => {
    setEditConfig(false);
    settingsStore.resetDeviceSettings();
  };

  const renderEditDialogs = () => {
    switch (settingsStore.editConfigIndex) {
    case EditConfigViews.ASSET_TYPE:
      return <ViewAssetTypeDialog onClose={closeDialog} />;
    case EditConfigViews.DEVICE_CONFIG:
      return <DeviceConfigDialog onClose={closeDialog} />;
    case EditConfigViews.SELECT_E_HANDLER:
      return <SelectEventHandlers onClose={closeDialog} />;
    case EditConfigViews.CONFIG_E_HANDLER:
      return <ConfigEventHandlers onClose={closeDialog} />;
    default:
      break;
    }
  };

  useEffect(() => {
    if (addAssetDialog) {
      document.title = locale.getString('titles.addAssetType');
    } else if (editConfig) {
      document.title = locale.getString('titles.deviceConfiguration');
    } else if (addAssetDialog) {
      document.title = locale.getString('titles.assetTypeDetails');
    } else {
      document.title = locale.getString('titles.manageAssetTypes');
    }
  }, [addAssetDialog, addAssetDialog, editConfig]);

  const viewAssetType: (assetType: AssetType) => VoidFunction = (
    assetType: AssetType
  ) =>
    action(() => {
      assetTypeStore.selectAssetType(assetType, true);
      setEditConfig(true);
      // toggleViewAssetDialog();
    });

  const toggleAddAssetDialog = () => {
    setAddAssetDialog(!addAssetDialog);
  };

  const renderAssetTable = () => {
    const tableRows: JSX.Element[] = assetTypeStore.assetTypes.map((assetType: AssetType) => {
      let channelCount: number = 0;
      assetType.variants.forEach((variant: AssetVariant) => {
        if (variant.channels) {
          channelCount += variant.channels.length;
        }
      });
      return (
        <TableRow hover key={assetType._id} >
          <TableCell>{assetType.name}</TableCell>
          <TableCell>{assetType.variants.length}</TableCell>
          <TableCell>{channelCount}</TableCell>
          <TableCell>
            <IconButton aria-label="edit" onClick={viewAssetType(assetType)}>
              <EditIcon color="primary" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    }
    );

    return (
      <TableContainer sx={{height: 'calc(100vh - 290px)', overflowY: 'scroll'}}>
        <Table stickyHeader aria-label="sticky table" size='small'>
          <TableHead sx={{borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
            <TableRow>
              {tableHeader.map((header) => {
                return (
                  <TableCell key={`assettypes-header${header}`} sx={{background: '#fff'}}>
                    {header}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box p={0}>
      <SubTitleBox>
        <Typography variant="h4">
          {locale.getString('settings.storedAssets')}
        </Typography>
        <Button color="secondary" onClick={toggleAddAssetDialog}>
          <Typography variant="button">
            {locale.getString('settings.addAsset')}
          </Typography>
        </Button>
      </SubTitleBox>
      <hr />
      {renderAssetTable()}
      {addAssetDialog && (
        <AddAssetTypeDialog
          onClose={toggleAddAssetDialog}
          openDeviceConfig={() => setEditConfig(true)}
        />
      )}
      {editConfig && renderEditDialogs()}
      <ScrollToTopBtn text={locale.getString('global.toTop')} />
    </Box>
  );
};

export default observer(AssetTypes);