import React, { useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

import { useRootContext } from '../../../../RootStore';
import AppState from '../../../../appState';
import SettingsStore from '../../../../settingsStore';

import { ReadTagAddressInput, ReadTagAddressVirtualInput, ReadTagCountInput, ReadTagCountVirtualInput, ReadTagNameInput, ReadTagNameVirtualInput } from './ReadTagTextinputs';

import {
  addButton,
  AddButtonContainer,
  deleteIcon,
  EventHandlerContainer,
  FlexCol,
  FlexRow,
  InnerContainer,
  Subtitle,
} from './styles';

const ReadAddress = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  const radioLabels: string[] = [
    locale.getString('global.variant'),
    locale.getString('global.phase'),
    locale.getString('global.rdy'),
  ];
  const radioKeys: string[] = ['is_asset_variant', 'is_phase', 'is_readiness', 'is_display'];

  const checkValues = () => {
    const results: boolean = settingsStore.read_tags.every(tag => !!tag.address && !!tag.name && typeof tag.count === 'number'
    );
    if (results === false){
      settingsStore.setDisabledNext(true);
    } else {
      settingsStore.setDisabledNext(false);
    }
  };
  const textFieldOnChange = (val: string | number, name: string, i: number, inputIndex?: number) => {
    const temp = [...settingsStore.read_tags];
    temp[i][name] = val;
    settingsStore.replacePlcTags(temp);
    if (appState.touchScreenMode && inputIndex){
      appState.setReadAddressStyle(inputIndex, name, false);
    }
    checkValues();
  };
  const addPlcTag = () => {
    appState.addNewReadAddressStyle();
    const temp = [...settingsStore.read_tags];
    temp.push({
      name: '',
      address: 0,
      count: 0,
      trigger_type_name: 'timer',
      trigger_value: settingsStore.trigger_value,
      is_readiness: false,
      is_asset_variant: false,
      is_phase: false,
      is_display: false
    });
    settingsStore.replacePlcTags(temp);
    checkValues();
  };
  const handleDelete = (index: number) => {
    const temp = toJS(settingsStore.read_tags);
    temp.splice(index, 1);
    settingsStore.replacePlcTags(temp);
    const tempMoveStyle = [...appState.readAddressStyles];
    tempMoveStyle.splice(index - 1, 1);
    appState.replaceReadAddressStyle(tempMoveStyle);
    const tempReadAddressStyle = [...appState.readAddressStyles];
    tempReadAddressStyle.splice(index - 1, 1);
    appState.replaceReadAddressStyle(tempReadAddressStyle);
    checkValues();
  };

  useEffect(() => {
    checkValues();
  }, [settingsStore.read_tags]);

  useEffect(() => {
    settingsStore.read_tags.forEach((tag, i) => {
      if (i !== 0){
        appState.addNewReadAddressStyle();
      }
    });
    const temp = [...settingsStore.read_tags];
    temp[0].trigger_value = settingsStore.trigger_value;
    temp[0].trigger_type_name = 'timer';
    settingsStore.replacePlcTags(temp);
  }, []);

  return (
    <EventHandlerContainer>
      <Typography variant="h3" sx={Subtitle} component="header">
        {locale.getString('settings.addressToRead')}
      </Typography>
      {!!settingsStore.read_tags.length && settingsStore.read_tags.map((tag, i) => {
        return (
          <InnerContainer key={`plc-read-address-${i}`}>
            <FormControl sx={{minWidth: 'auto', height: 'auto'}}>
              <RadioGroup
                row
                aria-labelledby={locale.getString('settings.addressToRead')}
                name="adress-to-read"
              >
                {radioLabels.map((label, index) => {
                  return (
                    <FlexCol key={`${label}-${i}-${index}`} mr={0.5} sx={{alignItems: 'center', minWidth: 51}}>
                      {i === 0 &&
                        <Typography variant="overline">{label}</Typography>
                      }
                      <Radio
                        checked={tag[radioKeys[index]]}
                        sx={{height: 45, width: 45}}
                        onChange={() => settingsStore.setPlcTagsWithKey(radioKeys[index], i, !tag[radioKeys[index]])}
                      />
                    </FlexCol>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FlexRow key={`session-detection-plctag-${i}`}>
              <FlexCol>
                {i === 0 && (
                  <Typography variant="overline">
                    {locale.getString('literals.name')}
                  </Typography>
                )}
                {i === 0 ?
                  <ReadTagNameInput i={i} onChange={textFieldOnChange} />
                  :
                  appState.readAddressStyles.length ?
                    <ReadTagNameVirtualInput i={i} onChange={textFieldOnChange} readAddressStyle={appState.readAddressStyles}/>
                    :
                    <Box/>
                }
              </FlexCol>
              <FlexCol sx={{alignItems: 'center', minWidth: 53}}>
                {i === 0 &&
                  <Typography variant="overline">
                    {locale.getString('settings.display')}
                  </Typography>
                }
                <Checkbox
                  sx={{width: 45, height: 45}}
                  checked={tag[radioKeys[3]]}
                  onChange={() => settingsStore.setPlcTagsWithKey(radioKeys[3], i, !tag[radioKeys[3]])}
                  inputProps={{ 'aria-label': 'display' }}
                />
              </FlexCol>
              <Box style={{ marginRight: 16 }} />
              <FlexCol mr={1}>
                {i === 0 && (
                  <Typography variant="overline">
                    {locale.getString('literals.address')}
                  </Typography>
                )}
                { i === 0 ?
                  <ReadTagAddressInput i={i} onChange={textFieldOnChange}  />
                  :
                  <ReadTagAddressVirtualInput i={i} onChange={textFieldOnChange} />
                }
              </FlexCol>
              <FlexCol>
                {i === 0 && (
                  <Typography variant="overline">
                    {locale.getString('settings.count')}
                  </Typography>
                )}
                {i === 0 ?
                  <ReadTagCountInput i={i} onChange={textFieldOnChange} />
                  :
                  <ReadTagCountVirtualInput i={i} onChange={textFieldOnChange} />
                }
              </FlexCol>
              {i !== 0 ?
                <Box onClick={() => handleDelete(i)} id={`delete_read_tags-${i}`}>
                  <DeleteIcon sx={deleteIcon} />
                </Box>
                :
                <Box sx={{width: 24, height: 30}} />
              }
            </FlexRow>
          </InnerContainer>
        );
      })}
      <Box sx={{ marginTop: 1 }} />
      <AddButtonContainer>
        <Button variant="text" sx={addButton} onClick={addPlcTag}>
          <AddIcon style={{ marginRight: 16, color: '#003965' }} />
          <Typography variant="button">
            {locale.getString('literals.add')}
          </Typography>
        </Button>
      </AddButtonContainer>
    </EventHandlerContainer>
  );
};

export default observer(ReadAddress);
