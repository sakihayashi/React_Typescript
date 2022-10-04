import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { MultiTimeVis } from '@otosense/multi-time-vis';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRootContext } from "../../App";
import AppState from "../../appState";
import { DppWizardStore } from ".";

const OutlierScores = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const locale: LocaleStore = appState.locale;
  if (!dppWizardStore.trainingResults) {
    return null;
  }

  const dropDownLabels = [
    locale.getString('wizard.testSessionNum'),
    locale.getString('wizard.phaseNum'),
  ];
  const options = [
    Array.from(
      { length: dppWizardStore.trainingSessionMap.length },
      (_, i) => i + 1,
    ),
    [...dppWizardStore.trainingPhaseMap],
  ];
  const values = [
    dppWizardStore.selectedTrainingSessionIdx + 1,
    dppWizardStore.selectedTrainingPhaseId,
  ];
  const setters = [
    (e: SelectChangeEvent) =>
      (dppWizardStore.selectedTrainingSessionIdx = +e.target.value - 1),
    (e: SelectChangeEvent) =>
      (dppWizardStore.selectedTrainingPhaseId = e.target.value),
  ];

  return (
    <div className="oto-drawer__datavis-container">
      <div className="oto-dropdown__container oto-flex-space-bet">
        {dropDownLabels.map((name, index) => {
          const unit = ` ${locale.getString('literals.of')} ${
            options[0].length
          }`;
          return (
            <div className="oto-dropdown__group oto-flex-box" key={name}>
              <div>
                <div className="oto-dropdown__label">{name}</div>
                <FormControl>
                  <Select
                    value={values[index].toString()}
                    onChange={setters[index]}
                    id={name + index}
                  >
                    {options[index].map((opt, i) => (
                      <MenuItem key={`${opt}-${i}`} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {index === 0 && (
                <div className="oto-dropdown__unit oto-spacer--mt-10px oto-spacer--ml-1_25rem">
                  {unit}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!!dppWizardStore.outlierResults.length && (
        <div className="otv__container">
          <MultiTimeVis
            annotations={[]}
            channels={dppWizardStore.outlierResults}
            channelHeight={106}
            chartType="bargraph"
            bt={dppWizardStore.selectedTrainingPhase.bt}
            leftX={0}
            maxScale={1}
            params={{}}
            rightX={1}
            tt={dppWizardStore.selectedTrainingPhase.tt}
            zoomable={false}
          />
        </div>
      )}
      <p className="oto-text_p">
        {locale.getString('wizard.testScale')} :{' '}
        {locale.getString('wizard.second')}
      </p>
    </div>
  );
};

export default observer(OutlierScores);
