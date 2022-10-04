import InfoIcon from '@mui/icons-material/Info';
import { Box, Grid, InputAdornment, Slider, Tooltip } from '@mui/material';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { TextIconBox } from '@otosense/components';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent } from 'react';
import { useRootContext } from "../../App";
import AppState from "../../appState";
import { DppWizardStore } from ".";

interface IProps {
  useDefault: boolean;
}

const InputSlider = (props: IProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const locale: LocaleStore = appState.locale;
  const min = [50, 1, 5];
  const max = [95, 80, 99];
  const settingsValues = [
    dppWizardStore.sessionPercentage,
    dppWizardStore.nOfFeatures,
    dppWizardStore.nOfCentroids,
  ];
  const marks = min.map((val: number, i: number) => [
    { value: val, label: val + " %" },
    { value: max[i], label: max[i] + " %" },
  ]);
  const settingKeys = ['sessionPercentage', 'nOfFeatures', 'nOfCentroids'];

  const infoPercentSession = (
    <TextIconBox>
      {locale.getString('wizard.percentageOfSessions')}
      <Tooltip title={locale.getString('wizard.toolTipPercentSessions')}>
        <InfoIcon color="gray" />
      </Tooltip>
    </TextIconBox>
  );
  const nOfFeatures = (
    <TextIconBox>
      {locale.getString('wizard.nOfFeatures')}
      <Tooltip title={locale.getString('wizard.toolTipNofFeatures')}>
        <InfoIcon color="gray" />
      </Tooltip>
    </TextIconBox>
  );
  const nOfCentroids = (
    <TextIconBox>
      {locale.getString('wizard.nOfCentroids')}
      <Tooltip title={locale.getString('wizard.toolTipNofCentroids')}>
        <InfoIcon color="gray" />
      </Tooltip>
    </TextIconBox>
  );
  const labels = [infoPercentSession, nOfFeatures, nOfCentroids];

  const handleSliderChange = (
    e: Event,
    newValue: number | number[],
    i: number
  ) => {
    dppWizardStore.setTrainingSettings(settingKeys[i], Number(newValue));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    dppWizardStore.setTrainingSettings(settingKeys[i], Number(e.target.value));
  };

  const handleBlur = (i: number) => {
    if (settingsValues[i] < min[i]) {
      dppWizardStore.setTrainingSettings(settingKeys[i], Number(min[i]));
    } else if (settingsValues[i] > max[i]) {
      dppWizardStore.setTrainingSettings(settingKeys[i], Number(max[i]));
    }
  };

  return (
    <Box sx={{ width: 700, m: 1, height: '100%' }}>
      {labels.map((label, i) => (
        <Box mb={1} key={`${label}-0${i}`}>
          <Typography id="input-slider" gutterBottom>
            {label}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={settingsValues[i]}
                onChange={(e: Event, val: number) =>
                  handleSliderChange(e, val, i)
                }
                aria-labelledby="input-slider"
                valueLabelDisplay="auto"
                max={max[i]}
                min={min[i]}
                step={1}
                marks={marks[i]}
                disabled={props.useDefault}
              />
            </Grid>
            <Grid item>
              <Input
                value={settingsValues[i]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, i)
                }
                onBlur={() => handleBlur(i)}
                disabled={props.useDefault}
                // defaultValue={defaults[i]}
                inputProps={{
                  step: 1,
                  min: min[i],
                  max: max[i],
                  type: "number",
                  'aria-labelledby': "input-slider",
                }}
                endAdornment={
                  <InputAdornment position="end">%</InputAdornment>
                }
                sx={{
                  backgroundColor: "#f3f3f3",
                  width: 100,
                  padding: "7px 16px",
                }}
                error={
                  settingsValues[i] < min[i] || settingsValues[i] > max[i]
                }
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default observer(InputSlider);
