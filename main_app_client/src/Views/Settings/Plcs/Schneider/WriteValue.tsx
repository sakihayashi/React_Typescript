import React from 'react';

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../../../RootStore';
import AppState from '../../../../appState';
import SettingsStore from '../../../../settingsStore';

import WriteQualityScore from './WriteQualityScore';
import WriteLearningMode from './WriteLearningMode';

const WriteValue = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const settingsStore: SettingsStore = root.settingsStore;
  const handleCheckbox = () => {
    if (settingsStore.isLearningMode){
      // will be false
      settingsStore.setPlcConfig('set_learning_mode', null);

    } else {
      settingsStore.setPlcConfig('quality_score', null);
    }
    settingsStore.toggleIsLearningMode();
  };
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={settingsStore.isLearningMode}
              onChange={handleCheckbox}
            />
          }
          label={locale.getString('reviewSessions.learningMode')}
        />
      </FormGroup>
      {settingsStore.isLearningMode ?
        <WriteLearningMode />
        :
        <WriteQualityScore />
      }
    </>
  );
};

export default observer(WriteValue);