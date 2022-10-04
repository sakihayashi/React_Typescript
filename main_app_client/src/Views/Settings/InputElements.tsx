import React from 'react';

import {Checkbox, FormControl, MenuItem, TableCell, TextField} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import LocaleStore from '@otosense/locale';
import {observer} from 'mobx-react-lite';
import {Fields} from '../../api';
import {VirtualInputContainer} from '@otosense/components';

import {useRootContext} from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';

interface IProps {
  field: Fields;
  index: number;
  childIndex: number;
  channelId: string;
  handleSelect?: (index: number, fieldName: string, value: string) => void;
  handleToggle?: (field: Fields, index: number) => void;
  handleChange?: (name: string, index: number) => void;
}

export const MultipleChoice = observer((props: IProps) => {
  const root = useRootContext();
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const {field, channelId, childIndex, index, handleSelect} = props;
  return (
    <TableCell key={`select-${field.name}-${childIndex}-${channelId}`}>
      {!!assetTypeStore.configs?.length &&
        !!assetTypeStore.fieldOptions?.length &&
        <FormControl size="small" sx={{width: 'auto', minWidth: 'auto'}}>
          <Select
            value={!!assetTypeStore.configs[index]
              ? assetTypeStore.configs[index][field.name]
              : ''
            }
            onChange={(e: SelectChangeEvent) =>
              handleSelect(index, field.name, e.target.value)
            }
            sx={{width: 132, height: 45, padding: '5px 16px'}}
          >
            {!!assetTypeStore.fieldOptions[index]?.length &&
              assetTypeStore.fieldOptions[index][childIndex].map(
                (option: number | string, i: number) => {
                  return (
                    <MenuItem key={`${option}-${i}`} value={option}>
                      {option}
                    </MenuItem>
                  );
                }
              )}
          </Select>
        </FormControl>
      }

    </TableCell>
  );
});

export const TextInput = observer((props: IProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const {field, channelId, childIndex, index} = props;
  return (
    <TableCell key={`textinput-${field.name}-${childIndex}-${channelId}`}>
      <VirtualInputContainer
        touchScreenMode={appState.touchScreenMode}
        moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[index]}
        onClose={() => appState.resetMoveUpStyle(index)}
        text={locale.getString('literals.close')}
      >
        <TextField
          id={`${index}-${field.name}`}
          aria-describedby={`${field.type}-input-${channelId}`}
          required
          variant="filled"
          placeholder={
            `${locale.getString('settings.enter')} ${locale.getString(`settings.${field.name}`)}`
          }
          sx={{margin: 0}}
          size="medium"
          value={
            assetTypeStore.configs?.length && assetTypeStore.configs[index]
              ? assetTypeStore.configs[index][field.name] + ''
              : ''
          }
          name={field.name}
          onChange={(e) => {
            const temp = [...assetTypeStore.configs];
            temp[index][field.name] = e.target.value;
            assetTypeStore.setConfigs(temp);
          }}
          onFocus={() => appState.setMoveUpStyle(index)}
          onBlur={(e) => {
            const temp = [...assetTypeStore.configs];
            temp[index][field.name] = e.target.value;
            assetTypeStore.setConfigs(temp);
          }}
        />
      </VirtualInputContainer>
    </TableCell>
  );
});

export const CheckBoxInput = observer((props: IProps) => {
  const root = useRootContext();
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const {field, channelId, childIndex, index, handleToggle} = props;
  const checked = (!!assetTypeStore.configs?.length && !!assetTypeStore.configs[index]
    && assetTypeStore.configs[index][field.name] != null)
    ? assetTypeStore.configs[index][field.name] : false;
  return (
    <TableCell key={`boolean-${field.name}-${childIndex}-${channelId}`}>
      <Checkbox
        key={`checkbox-${field.name}-${childIndex}-${channelId}`}
        id={`checkbox-${field.name}-${childIndex}-${channelId}`}
        name={field.name}
        onChange={() => handleToggle(field, index)}
        checked={checked}
      />
    </TableCell>
  );
});

export const RangeInput = observer((props: IProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const {field, channelId, childIndex, index, handleChange} = props;
  return (
    <TableCell key={`${field.name}-${childIndex}-${channelId}`}>
      <TextField
        aria-describedby={`${field.name}-input`}
        type="number"
        value={assetTypeStore.configs[index][field.name] + '' || ''}
        placeholder={locale.getString(`settings.${field.name}`)}
        onChange={() => handleChange(field.name, index)}
        size="small"
        required
      />
    </TableCell>
  );
});
