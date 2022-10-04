import React, { useEffect } from 'react';

import { TableCell, TextField } from '@mui/material';
import LocaleStore from '@otosense/locale';
// import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Fields } from '../../api';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';

interface IProps {
  field: Fields;
  index: number;
  channelId: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => void;
}

export const TextInput = observer((props: IProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const { field, channelId, index, type, onChange } = props;
  const placeHolder = `${locale.getString('settings.enter')} ${locale.getString('settings.broker_ip_address')}`;
  useEffect(() => {
    if (!assetTypeStore.config[field.name] && field.default){
      assetTypeStore.setConfig(field.name, field.default + '');
    }
  }, []);
  return (
    <TableCell key={`textinput-${field.name}-${channelId}`}>
      <TextField
        id={`${index}-${field.name}`}
        aria-describedby={`${field.type}-input-${channelId}`}
        placeholder={placeHolder}
        required
        size="small"
        type={type}
        value={assetTypeStore.config[field.name] || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e, field.name)}
      />
    </TableCell>
  );
});

