import React, { useEffect, useState } from 'react';

import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Fields } from '../../api';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';
import SettingsStore from '../../settingsStore';

import { CheckBoxInput, MultipleChoice, RangeInput, TextInput } from './InputElements';

const NonSoundcardTable = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const [couplingIndex, setCouplingIndex] = useState<number>(null);
  const [modeIndex, setModeIndex] = useState<number>(null);

  const handleSelect = (index: number, fieldName: string, value: string) => {
    const tempArr = toJS(assetTypeStore.configs);
    tempArr[index][fieldName] = value;
    assetTypeStore.setConfigs(tempArr);
  };

  const handleChange: (
    fieldName: string,
    index: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void =
    (fieldName: string, index: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempArr = [...assetTypeStore.configs];
        tempArr[index][fieldName] = e.target.value;
        assetTypeStore.setConfigs(tempArr);
      };

  const handleToggle = (field: Fields, index: number)  => {
    const cloneConfig = toJS(assetTypeStore.configs);
    cloneConfig[index][field.name] = !cloneConfig[index][field.name];
    const cloneOptions = toJS(assetTypeStore.fieldOptions);
    const couplingObj: Fields = settingsStore.selectedReader.fields.find(
      (obj) => obj.name === 'coupling'
    );
    const modeObj: Fields = settingsStore.selectedReader.fields.find(
      (obj) => obj.name === 'mode'
    );

    if (assetTypeStore.configs[index][field.name]) {
      if (!!couplingObj.if_iepe) {
        cloneConfig[index].coupling = couplingObj.if_iepe;
      }
      if (!!modeObj.if_iepe) {
        cloneConfig[index].mode = modeObj.if_iepe;
      }
      const newArr = cloneOptions.map((innerArr: any, i) => {
        if (i === index) {
          return innerArr.map((arr: any, j: number) => {
            if (j === couplingIndex) {
              if (couplingObj.if_iepe) {
                return [couplingObj.if_iepe];
              } else {
                return arr;
              }
            } else if (j === modeIndex) {
              if (modeObj.if_iepe) {
                return [modeObj.if_iepe];
              } else {
                return arr;
              }
            } else {
              return arr;
            }
          });
        } else {
          return innerArr;
        }
      });
      assetTypeStore.setFieldOptions(newArr);
    } else {
      cloneConfig[index].coupling = couplingObj.values[0];
      cloneConfig[index].mode = modeObj.values[0];
      const newArr = cloneOptions.map((innerArr: any, i) => {
        if (i === index) {
          return innerArr.map((arr: any, j) => {
            if (j === couplingIndex) {
              return couplingObj.values;
            } else if (j === modeIndex) {
              return modeObj.values;
            } else {
              return arr;
            }
          });
        } else {
          return innerArr;
        }
      });
      assetTypeStore.setFieldOptions(newArr);
    }
    assetTypeStore.setConfigs(cloneConfig);
  };

  const renderRow = (
    field: Fields,
    index: number,
    channelId: string,
    childIndex: number
  ) => {
    switch (field.type) {
    case 'multiple choice':
      return (
        <MultipleChoice
          key={`${field.channel_id}-${index}-${childIndex}`}
          index={index}
          field={field}
          childIndex={childIndex}
          channelId={channelId}
          handleSelect={handleSelect}
        />
      );
    case 'text input':
      return (
        <TextInput
          key={`${field.channel_id}-${index}-${childIndex}`}
          index={index}
          field={field}
          childIndex={childIndex}
          channelId={channelId}
        />
      );
    case 'boolean':
      return (
        <CheckBoxInput
          key={`${field.channel_id}-${index}-${childIndex}`}
          index={index}
          field={field}
          childIndex={childIndex}
          channelId={channelId}
          handleToggle={handleToggle}
        />
      );
    case 'range':
      return (
        <RangeInput
          key={`${field.channel_id}-${index}-${childIndex}`}
          index={index}
          field={field}
          childIndex={childIndex}
          channelId={channelId}
          handleChange={handleChange}
        />
      );
    default:
      return;
    }
  };
  const getData = () => {
    const cloneReader = { ...settingsStore.selectedReader };
    const configData = !!cloneReader.channel_ids?.length && cloneReader.channel_ids.map((id: string) => {
      const configObj: Fields = {};
      const arr = !!cloneReader.fields?.length && cloneReader.fields.map((field) => {
        if (field.is_per_device_channel) {
          configObj[field.name] =
            field.type === 'multiple choice'
              ? field.values[0]
              : field.type === 'boolean'
                ? false
                : field.type === 'text input'
                  ? ''
                  : field.default;
          return field.name;
        }
      });
      if (arr) {
        configObj.channel_id = id;
        return configObj;
      }
    });
    // set this if empty
    assetTypeStore.setConfigs(configData);
    const resultArr = getOptions();
    assetTypeStore.setFieldOptions(resultArr);
  };

  const getOptions = () => {
    const cloneReader = toJS(settingsStore.selectedReader);
    const options = !!cloneReader.fields?.length && cloneReader.fields.map((field, index) => {
      if (field.name !== 'sample_rate') {
        if (field.type === 'multiple choice') {
          if (field.name === 'coupling') {
            setCouplingIndex(index);
          }
          if (field.name === 'mode') {
            setModeIndex(index);
          }
          return field.values;
        } else {
          return [];
        }
      }
    });
    const tempArr = [];
    if (options) {
      cloneReader.channel_ids.forEach(() => tempArr.push(options));
    }
    return tempArr;
  };
  useEffect(() => {
    if (!!assetTypeStore.configs?.length) {
      const resultArr = getOptions();
      assetTypeStore.setFieldOptions(resultArr);
    }
    if (
      settingsStore.isFirstTime === false &&
      settingsStore.selectedReaderName !== settingsStore.savedReaderName
    ) {
      getData();
    }
    if (settingsStore.selectedReaderName === settingsStore.savedReaderName) {
      assetTypeStore.setConfigs(settingsStore.savedConfigs);
      const resultArr = getOptions();
      assetTypeStore.setFieldOptions(resultArr);
    }
  }, [settingsStore.selectedReaderName]);

  useEffect(() => {
    if (!!assetTypeStore.configs?.length) {
      const resultArr = getOptions();
      assetTypeStore.setFieldOptions(resultArr);
    } else {
      getData();
    }
  }, []);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{locale.getString('settings.channel_selected')}</TableCell>
          <TableCell>{locale.getString('settings.channel_ids')}</TableCell>
          {!!settingsStore.selectedReader.fields?.length && settingsStore.selectedReader.fields.length >= 4 &&
            settingsStore.selectedReader.fields.map((field, index) => {
              if (
                field.is_per_device_channel === true &&
                field.name !== 'channel_selected'
              ) {
                return (
                  <TableCell key={`reader-${field.name}-${index}`}>
                    {locale.getString(`settings.${field.name}`)}
                  </TableCell>
                );
              }
            })}
        </TableRow>
      </TableHead>
      <TableBody>
        {!!settingsStore.selectedReader?.channel_ids?.length &&
        settingsStore.selectedReader.channel_ids.length >= 4 && settingsStore.selectedReader.channel_ids.map((id, index) => {
          return (
            <TableRow key={`channel-config-${id}-${index}`}>
              {!!settingsStore.selectedReader?.fields?.length &&
                  settingsStore.selectedReader.fields.map(
                    (field, childIndex) => {
                      if (field.name === 'channel_selected') {
                        return (
                          <TableCell
                            key={`channel-config-${id}-${index}-${childIndex}`}
                          >
                            <Checkbox
                              name={field.name}
                              onChange={() => handleToggle(field, index)}
                              checked={
                                // assetTypeStore.configs?.length >=
                                settingsStore.selectedReader?.fields?.length &&
                                !!assetTypeStore.configs[index]
                                  && assetTypeStore.configs[index][field.name]
                              }
                            />
                          </TableCell>
                        );
                      }
                    }
                  )}
              <TableCell>{id}</TableCell>
              {!!settingsStore.selectedReader.fields?.length && settingsStore.selectedReader.fields.length >= 4 &&
                  settingsStore.selectedReader.fields.map(
                    (field, childIndex) => {
                      if (
                        field.is_per_device_channel === true &&
                        field.name !== 'channel_selected'
                      ) {
                        return renderRow(field, index, id, childIndex);
                      }
                    }
                  )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default observer(NonSoundcardTable);
