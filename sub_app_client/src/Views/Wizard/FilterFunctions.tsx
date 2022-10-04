import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FeedbackEnum } from '../../api';
import { useRootContext } from '../../App';
import AppState from '../../appState';
import DppWizardStore from './store';

export const RenderQualityDropDown = observer(() => {
  const opts: string[] = [];
  for (let i: number = 10; i > 0; i = i - 1) {
    opts.push(i.toString());
  }
  const root = useRootContext();
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;

  const changeUnderScoreState = (e: any) => {
    const str = e.target.value;
    const tempVal = str === 'true';
    dppWizardStore.undescoreStateChange(tempVal);
  };

  const onQualityScoreChange = (e: SelectChangeEvent) => {
    dppWizardStore.onQualityScoreChange(Number(e.target.value));
  };
  const above = locale.getString('filter.above');
  const under = locale.getString('filter.under');
  console.log('val', dppWizardStore.filterScore);

  return (
    <>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="quality score above or below"
          defaultValue="false"
          name="filter-qs-radio"
          onChange={changeUnderScoreState}
        >
          <FormControlLabel
            value="false"
            control={<Radio />}
            label={above}
            defaultChecked
          />
          <FormControlLabel value="true" control={<Radio />} label={under} />
        </RadioGroup>
      </FormControl>
      <FormControl sx={{ pt: 1, minWidth: 120, mt: 1, ml: '32px', mb: 2 }}>
        <Select
          onChange={onQualityScoreChange}
          value={dppWizardStore.filterScore + ''}
        >
          {opts.map((score, i) => (
            <MenuItem key={`score-${score}-${i}`} value={score}>
              {score}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
});

export const RenderFeedbackFilter = observer(() => {
  const root = useRootContext();
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const titles = [
    locale.getString('filter.all'),
    locale.getString('filter.noFeedback'),
    locale.getString('filter.pass'),
    locale.getString('filter.fail'),
  ];
  const values = [
    FeedbackEnum.ALL,
    FeedbackEnum.UNSET,
    FeedbackEnum.PASS,
    FeedbackEnum.FAIL,
  ];
  const handleFeedbackFilter = (e: any) => {
    dppWizardStore.setFeedbackFilter(Number(e.target.value));
  };
    //   const handleFeedbackFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     reviewSessionsStore.setFeedbackFilter(Number(e.target.value));
    //   };
  return (
    <FormControl component="fieldset" sx={{ height: 'auto' }}>
      <RadioGroup
        aria-label="filter feedback"
        value={dppWizardStore.filterFeedback}
        name="filter-feedback-radio"
        onChange={handleFeedbackFilter}
      >
        {titles.map((title, index) => (
          <FormControlLabel
            value={values[index]}
            control={<Radio />}
            label={title}
            key={`feedback-${title}-${index}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
});

export const RenderDateFilter = observer(() => {
  const root = useRootContext();
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]);

  const setDateInStore = (dates: Date[]) => {
    const startDate = dates[0] ? dates[0].getTime() * 1000 : null;
    const endDate = dates[1] ? dates[1].getTime() * 1000 : null;
    const oneDay = 86399999999; // inclusive end date by pushing date to the very end of the day.
    dppWizardStore.onStartDateChange(startDate);
    dppWizardStore.onStopDateChange(endDate + oneDay);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText=""
        endText=""
        value={value}
        onChange={(newValue) => {
          setDateInStore(newValue);
          setValue(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <Box mr={0.5}>
              <Typography variant="overline">
                {locale.getString('filter.startDate')}
              </Typography>
              <TextField {...startProps} size="small" />
            </Box>
            <Box>
              <Typography variant="overline">
                {locale.getString('filter.endDate')}
              </Typography>
              <TextField {...endProps} size="small" />
            </Box>
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
});
