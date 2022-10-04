import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';

import { VirtualInputContainer } from '@otosense/components';

const SoundCardTable = () => {
  const root = useRootContext();
  const settingsStore = root.settingsStore;
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const inputIndex = 0;

  const handleChange: (
    fieldName: string
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      assetTypeStore.setConfig(fieldName, e.target.value);
    };

  return (
    <Table>
      <TableHead>
        <TableRow>
          {settingsStore.selectedReader &&
          settingsStore.selectedReader.fields.length &&
            settingsStore.selectedReader.fields.map((field, index) => {
              if (field.is_per_device_channel) {
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
          {settingsStore.selectedReader &&
          settingsStore.selectedReader.fields &&
          settingsStore.selectedReader.fields.length &&
            settingsStore.selectedReader.fields.map((field, index) => {
              if (field.is_per_device_channel) {
                if (field.type === 'text input') {
                  return (
                    <TableCell key={`${field.name}-${index}`}>
                      <VirtualInputContainer
                        touchScreenMode={appState.touchScreenMode}
                        moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[inputIndex]}
                        onClose={() => appState.resetMoveUpStyle(inputIndex)}
                        text={locale.getString('literals.close')}
                      >
                        <TextField
                          aria-describedby={`${field.type}-input`}
                          placeholder={locale.getString(`settings.${field.name}`)}
                          value={assetTypeStore.config[field.name] || ''}
                          onChange={handleChange(field.name)}
                          onFocus={() => appState.setMoveUpStyle(inputIndex)}
                          onBlur={handleChange(field.name)}
                        />
                      </VirtualInputContainer>
                    </TableCell>
                  );
                }
              }
            })}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default observer(SoundCardTable);
