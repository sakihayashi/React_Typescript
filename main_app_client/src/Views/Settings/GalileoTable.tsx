import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import {observer} from 'mobx-react-lite';

import {useRootContext} from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';
import {Fields} from '../../api';
import {TextInput} from './GalileoInputElements';

const GalileoTable = () => {
  const root = useRootContext();
  const settingsStore = root.settingsStore;
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    assetTypeStore.setConfig(fieldName, e.target.value);
  };

  const renderCells = (
    field: Fields,
    index: number,
    channelId: string,
  ) => {
    const childIndex = index;
    switch (field.type) {
    case 'numeric input':
      return (
        <TextInput
          key={`${field.channel_id}-${index}-${childIndex}`}
          index={index}
          field={field}
          channelId={channelId}
          type="number"
          onChange={handleChange}
        />
      );
    case 'text input':
      return (
        <TextInput
          key={`${field.channel_id}-${index}-${childIndex}`}
          index={index}
          field={field}
          channelId={channelId}
          type="text"
          onChange={handleChange}
        />
      );
    default:
      return;
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          {settingsStore.selectedReader?.fields.length &&
            settingsStore.selectedReader.fields.map((field, index) => {
              if (field.hasOwnProperty('display_per_channel_config')) {
                return (
                  <TableCell key={`field-name-${field.name}-${index}`}>
                    {locale.getString(`settings.${field.name}`)}
                  </TableCell>
                );
              }
            })}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {settingsStore.selectedReader?.fields.length &&
            settingsStore.selectedReader.fields.map((field, i) => {
              if (!field.is_per_device_channel) {
                return renderCells(field, i, settingsStore.selectedReader.channel_ids[i]);
              }
            })
          }
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default observer(GalileoTable);
