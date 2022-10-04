import Brightness1Icon from '@mui/icons-material/Brightness1';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { SvgIconProps } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react';
import React from 'react';
import { useRootContext } from '../../App';
import AppState from '../../appState';

export const ProgressStepper = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore = root.dppWizardStore;
  const locale: LocaleStore = appState.locale;
  const stepTitles = [
    locale.getString('wizard.selectPipeline'),
    locale.getString('wizard.selectSessions'),
    locale.getString('wizard.addPhaseDefinitions'),
    locale.getString('wizard.trainingSettings'),
    locale.getString('wizard.trainingResults'),
  ];

  const getStepClasses = () => {
    const tempClasses: string[] = [];
    const tempIcons: Array<React.ReactElement<SvgIconProps>> = [];
    for (let i: number = 0; i < dppWizardStore.step; i++) {
      tempClasses.push('oto-step oto-complete');
      tempIcons.push(<CheckCircleIcon className="oto-check" />);
    }
    tempClasses.push('oto-step oto-highlighted');
    tempIcons.push(<Brightness1Icon className="oto-check" />);
    if (dppWizardStore.step < 4) {
      for (let i: number = dppWizardStore.step + 1; i <= 4; i++) {
        tempClasses.push('oto-step oto-incomplete');
        tempIcons.push(<RadioButtonUncheckedIcon className="oto-check" />);
      }
    }
    return [tempClasses, tempIcons];
  };

  const [classes, icons] = getStepClasses();

  return (
    <div className="oto-stepper">
      {stepTitles &&
        stepTitles.map((title, index) => {
          const lastNum = index + 1;
          return (
            <div className={classes[index]} key={title + index}>
              <div className="oto-stepCheck">
                {icons[index]}
                {lastNum < stepTitles.length && (
                  <div className="oto-stepLine" />
                )}
              </div>
              <div className="oto-stepName">
                <p className="oto-step-p">{title}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default observer(ProgressStepper);
