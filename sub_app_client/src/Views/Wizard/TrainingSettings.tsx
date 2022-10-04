import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import LocaleStore from '@otosense/locale';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useRootContext } from "../../App";
import AppState from "../../appState";
import InputSlider from "./Sliders";
import { DppWizardStore } from ".";

export const TrainingSettings = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const locale: LocaleStore = appState.locale;
  const defaults = [58, 56, 23];
  const [useDefault, setUseDefault] = useState<boolean>(true);

  const checkBoxLabel = locale.getString('wizard.useDefault');
  const settingKeys = ['sessionPercentage', 'nOfFeatures', 'nOfCentroids'];

  const toggleSlider = () => {
    if (!useDefault) {
      defaults.forEach((val: number, index: number) => {
        dppWizardStore.setTrainingSettings(settingKeys[index], val);
      });
    }
    setUseDefault(!useDefault);
  };

  useEffect(() => {
    // phase definition off until PLC is done
    dppWizardStore.setPhaseDefinitionApi();
    document.title = locale.getString('titles.buildDppTrainingSettings');
  }, []);

  return (
    <>
      <h2 className="oto-text_h2 oto-spacer--mb-40px">
        {locale.getString('wizard.trainingSettings')}
      </h2>
      <main>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="useDefault"
                onChange={toggleSlider}
                checked={useDefault}
              />
            }
            label={checkBoxLabel}
          />
        </FormGroup>
        <InputSlider useDefault={useDefault} />
      </main>
    </>
  );
};

export default observer(TrainingSettings);
