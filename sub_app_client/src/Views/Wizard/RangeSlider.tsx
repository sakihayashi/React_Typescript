import {
  Box,
  Grid,
  Input,
  InputAdornment,
  Slider,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useRootContext } from "../../App";
import AppState from "../../appState";
import AssetTypeStore from "../../assetTypeStore";
import { DppWizardStore } from ".";

function valuetext(value: number) {
  return `${value}%`;
}

export const RangeSliderInput = styled(Input)({
  width: 80,
  background: '#f3f3f3',
  padding: 7,
});

const minDistance = 1;

const RangeSlider = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const [value1, setValue1] = React.useState<number[]>([20, 37]);
  const [value, setValue] = React.useState<
  number | string | Array<number | string>
  >(30);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const temp: number[] = [...dppWizardStore.percentileVals];
    console.log('temp', temp);

    temp[i] = Number(e.target.value);
    dppWizardStore.setPercentileVals(temp);
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const handleSliderChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      dppWizardStore.setPercentileVals([
        Math.min(newValue[0], dppWizardStore.percentileVals[1] - minDistance),
        dppWizardStore.percentileVals[1],
      ]);
    } else {
      dppWizardStore.setPercentileVals([
        dppWizardStore.percentileVals[0],
        Math.max(newValue[1], dppWizardStore.percentileVals[0] + minDistance),
      ]);
    }
  };

  return (
    <Box sx={{ width: 600 }} mb={1}>
      <Grid container spacing={0.6}>
        <Grid item>
          <RangeSliderInput
            value={dppWizardStore.percentileVals[0]}
            size="small"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, 0)
            }
            onBlur={handleBlur}
            inputProps={{
              'step': 1,
              'min': 0,
              'max': 99,
              'type': 'number',
              'aria-labelledby': 'input-slider',
            }}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
          />
        </Grid>
        <Grid item>
          <Slider
            getAriaLabel={() => 'Minimum distance'}
            value={dppWizardStore.percentileVals}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            disableSwap
            sx={{ width: 128 }}
          />
        </Grid>
        <Grid item>
          <RangeSliderInput
            value={dppWizardStore.percentileVals[1]}
            size="small"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, 1)
            }
            onBlur={handleBlur}
            inputProps={{
              'step': 1,
              'min': 1,
              'max': 100,
              'type': 'number',
              'aria-labelledby': 'input-slider',
            }}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default observer(RangeSlider);
