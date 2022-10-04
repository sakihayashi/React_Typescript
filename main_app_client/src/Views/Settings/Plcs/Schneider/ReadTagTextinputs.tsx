import React, { ChangeEvent } from 'react';

import {
  InputAdornment,
  TextField,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { VirtualInputContainer } from '@otosense/components';

import { useRootContext } from '../../../../RootStore';
import AppState, { ReadAddress } from '../../../../appState';
import SettingsStore from '../../../../settingsStore';

import {
  FormStyle,
} from './styles';

interface IProps {
  onChange: (val: string | number, name: string, i: number, inputIndex?: number, fieldName?: string) => void;
  i: number;
  // inputIndex?: number;
  readAddressStyle?: ReadAddress[];
}

export const ReadTagNameInput = (props: IProps) => {
  const { onChange, i } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;

  return (
    <TextField
      size="small"
      key={`read-tag-name-${i}`}
      placeholder={locale.getString('settings.enterName')}
      sx={FormStyle}
      value={settingsStore.read_tags[i].name || ''}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
      {
        onChange(e.target.value, e.target.name, i);
      }}
      name="name"
    />
  );
};

export const ReadTagNameVirtualInput = (props: IProps) => {
  const { onChange, i } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;

  return (
    <>
      <VirtualInputContainer
        touchScreenMode={appState.touchScreenMode}
        moveUpStyle={appState.readAddressStyles.length && appState.readAddressStyles[i - 1].name}
        onClose={() => appState.setReadAddressStyle(i - 1, 'name', false)}
        text={locale.getString('literals.close')}
      >
        <>
          <TextField
            size="small"
            key={`read-tag-name-${i}`}
            placeholder={locale.getString('settings.enterName')}
            sx={FormStyle}
            value={settingsStore.read_tags[i].name && settingsStore.read_tags[i].name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
            {
              onChange(e.target.value, e.target.name, i, i - 1);
            }}
            onFocus={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => appState.setReadAddressStyle(i -1, e.target.name, true)}
            onBlur={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            {
              onChange(e.target.value, e.target.name, i, i - 1);
            }}
            name="name"
          />
        </>
      </VirtualInputContainer>
    </>


  );
};

export const ReadTagAddressInput =  (props: IProps) => {
  const { onChange, i } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  return (
    <TextField
      error={!settingsStore.read_tags[i].address}
      key={`read-tag-address-${i}`}
      placeholder={locale.getString('settings.enterAddress')}
      size="small"
      sx={FormStyle}
      type="number"
      value={settingsStore.read_tags[i].address &&settingsStore.read_tags[i].address + ''}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{ marginBottom: '16px' }}
          >
                          %MW
          </InputAdornment>
        ),
      }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (isNaN(+e.target.value)) {
          return;
        } else {onChange(+e.target.value, e.target.name, i); }
      }}
      name="address"
    />
  );
};

export const ReadTagAddressVirtualInput = (props: IProps) => {
  const { onChange, i } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;

  return (
    <VirtualInputContainer
      touchScreenMode={appState.touchScreenMode}
      moveUpStyle={appState.readAddressStyles.length && appState.readAddressStyles[i - 1] && appState.readAddressStyles[i - 1].address}
      onClose={() => appState.setReadAddressStyle(i - 1, 'address', false)}
      text={locale.getString('literals.close')}
    >
      <TextField
        error={!settingsStore.read_tags[i].address}
        key={`read-tag-address-${i}`}
        placeholder={locale.getString('settings.enterAddress')}
        size="small"
        sx={FormStyle}
        type="number"
        value={settingsStore.read_tags[i].address || ''}
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{ marginBottom: '16px' }}
            >
                          %MW
            </InputAdornment>
          ),
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (isNaN(+e.target.value)) {
            return;
          } else {onChange(+e.target.value, e.target.name, i); }
        }}
        onFocus={() => appState.setReadAddressStyle(i - 1, 'address', true)}
        onBlur={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          if (isNaN(+e.target.value)) {
            return;
          } else { onChange(+e.target.value, e.target.name, i); }
        }}
        name="address"
      />
    </VirtualInputContainer>
  );
};

export const ReadTagCountInput = (props: IProps) => {
  const { onChange, i } = props;
  const root = useRootContext();
  const settingsStore: SettingsStore = root.settingsStore;
  return (
    <TextField
      key={`read-tag-count-${i}`}
      sx={FormStyle}
      placeholder="0x0001"
      size="small"
      type="number"
      value={settingsStore.read_tags[i].count &&settingsStore.read_tags[i].count + ''}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (isNaN(+e.target.value)){
          return;
        } else {onChange(+e.target.value, e.target.name, i);}
      }}
      name="count"
    />
  );
};

export const ReadTagCountVirtualInput = (props: IProps) => {
  const { onChange, i } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  return (
    <VirtualInputContainer
      touchScreenMode={appState.touchScreenMode}
      moveUpStyle={appState.readAddressStyles.length && appState.readAddressStyles[i - 1] && appState.readAddressStyles[i - 1].count}
      onClose={() => appState.setReadAddressStyle(i - 1, 'count', false)}
      text={locale.getString('literals.close')}
    >
      <TextField
        key={`read-tag-count-${i}`}
        sx={FormStyle}
        placeholder="0x0001"
        size="small"
        type="number"
        value={settingsStore.read_tags[i].count && settingsStore.read_tags[i].count + ''}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (isNaN(+e.target.value)){
            return;
          } else {onChange(+e.target.value, e.target.name, i, i - 1, 'count');}
        }}
        onFocus={() => appState.setReadAddressStyle(i -1, 'count', true)}
        onBlur={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          if (isNaN(+e.target.value)){
            return;
          } else {onChange(+e.target.value, e.target.name, i, i - 1, 'count');}
        }}
        name="count"
      />
    </VirtualInputContainer>
  );
};
