import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { RootStoreContext } from '../../App';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';

export const SelectPipeline = () => {
  const root = useContext(RootStoreContext);
  const appState: AppState = root.appState;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const locale: LocaleStore = appState.locale;
  const headers = [
    locale.getString('global.assetType'),
    locale.getString('global.assetVariant'),
    locale.getString('global.assetPipeline'),
  ];
  const selectAssetType = (e: SelectChangeEvent) => {
    assetTypeStore.selectAssetTypeByName(e.target.value, true);
  };

  const selectVariant = (e: SelectChangeEvent) => {
    assetTypeStore.selectVariantById(e.target.value, true);
  };

  const selectChannel = (e: SelectChangeEvent) => {
    assetTypeStore.selectChannelByName(e.target.value);
  };
  const options = [
    assetTypeStore.assetTypeNames ? assetTypeStore.assetTypeNames : ['none'],
    assetTypeStore.variantIds ? assetTypeStore.variantIds : ['none'],
    assetTypeStore.variantChannelNames
      ? assetTypeStore.variantChannelNames
      : ['none'],
  ];
  const handleChanges = [selectAssetType, selectVariant, selectChannel];
  const values = [
    assetTypeStore.selectedAssetType
      ? assetTypeStore.selectedAssetType.name
      : '',
    assetTypeStore.selectedVariant ? assetTypeStore.selectedVariant._id : '',
    assetTypeStore.selectedChannel ? assetTypeStore.selectedChannel.name : '',
  ];

  useEffect(() => {
    document.title = locale.getString('titles.buildDppSelectPipeline');
  });

  return (
    <>
      <Typography variant="h2" mb={1}>
        {locale.getString('wizard.selectPipeline')}
      </Typography>
      <Grid container spacing={1}>
        {headers.map((header, i) => (
          <Grid item xs={4} key={`form-identifier-input-${header}-${i}`}>
            <FormControl sx={{ minWidth: "100%" }} fullWidth={true}>
              <Typography variant="overline">{header}</Typography>
              <Select value={values[i]} onChange={handleChanges[i]}>
                {options[i] &&
                    options[i].map((name, j) => (
                        <MenuItem
                            key={`assettype-option-${name}-${j}`}
                            value={name}
                        >
                            {name}
                        </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default observer(SelectPipeline);
