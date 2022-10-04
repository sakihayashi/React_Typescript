import React, { ChangeEvent, useEffect, useState } from 'react';

import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { FeedbackEnum } from '../../api';
import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';
import ReviewSessionsStore from '../ReviewSessions/store';

import { firstLetterStyle } from 'globalStyles/texts';

const renderSearchableFilter: (
  defaultProps: any,
  onChange: any,
  label: string,
  value: string,
) => JSX.Element = (defaultProps: any, onChange: any, label: string, value: string) => (
  <Autocomplete
    {...defaultProps}
    id={`filter-${label}`}
    onChange={(e: any, newValue: string | number | null) => {
      if (newValue) {
        onChange(newValue);
      } else {
        onChange('');
      }
    }}
    value={value || ''}
    renderInput={(params) => (
      <TextField {...params} placeholder={label} variant="filled" />
    )}
  />
);

export const RenderAssetTypeFilter = observer(() => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const defaultProps = {
    options: assetTypeStore.assetTypeNames,
  };
  return renderSearchableFilter(
    defaultProps,
    assetTypeStore.setAssetTypeName,
    locale.getString('settings.enterAssetType'),
    assetTypeStore.selectedAssetType?.name || ''
  );
});

export const RenderAssetVariantFilter = observer(() => {
  const root = useRootContext();
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const defaultProps = {
    options: assetTypeStore.variantIds,
  };
  return renderSearchableFilter(
    defaultProps,
    assetTypeStore.setAssetVariantName,
    locale.getString('settings.enterAssetVariant'),
    assetTypeStore.selectedVariant?._id || ''
  );
});

export const RenderQualityDropDown = observer(() => {
  const opts: string[] = [];
  for (let i: number = 10; i > 0; i = i - 1) {
    opts.push(i.toString());
  }
  const root = useRootContext();
  const { appState, reviewSessionsStore } = root;
  const { locale } = appState;

  const changeUnderScoreState = (e: SelectChangeEvent<unknown>) => {
    const str = e.target.value;
    const state = str === 'true';
    reviewSessionsStore.setFilterUnderScore(state);
  };

  const onQualityScoreChange = (e: SelectChangeEvent<unknown>) => {
    reviewSessionsStore.setFilterScore(+e.target.value);
  };
  const above = <Box sx={{'::first-letter': {textTransform: 'uppercase'}}}>{locale.getString('literals.over')}</Box>;
  const under = <Box sx={{'::first-letter': {textTransform: 'uppercase'}}}>{locale.getString('reviewSessions.under')}</Box>;

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
            sx={{'::first-letter': {textTransform: 'uppercase'}}}
            defaultChecked
          />
          <FormControlLabel
            value="true"
            control={<Radio />}
            label={under}
            sx={firstLetterStyle}
          />
        </RadioGroup>
      </FormControl>
      <FormControl
        variant="filled"
        sx={{ pt: 1, minWidth: 120, mt: 1, ml: '32px' }}
      >
        <Select
          id="quality-score-filter"
          onChange={onQualityScoreChange}
          value={reviewSessionsStore.filterScore || ''}
        >
          {opts.map((score, i) => {
            return (
              <MenuItem key={`score-${score}-${i}`} value={score}>
                {score}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
});

export const RenderFeedbackFilter = observer(() => {
  const root = useRootContext();
  const { appState, reviewSessionsStore } = root;
  const { locale } = appState;
  const titles = [
    locale.getString('reviewSessions.all'),
    locale.getString('reviewSessions.noFeedback'),
    locale.getString('reviewSessions.pass'),
    locale.getString('reviewSessions.fail'),
  ];
  const values = [
    FeedbackEnum.ALL,
    FeedbackEnum.UNSET,
    FeedbackEnum.PASS,
    FeedbackEnum.FAIL,
  ];
  const handleFeedbackFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    reviewSessionsStore.setFeedbackFilter(+e.target.value);
  };
  return (
    <FormControl component="fieldset" sx={{minHeight: 160}}>
      <RadioGroup
        aria-label="filter feedback"
        value={reviewSessionsStore.filterFeedback}
        name="filter-feedback-radio"
        onChange={handleFeedbackFilter}
      >
        {titles.map((title, index) => {
          return (
            <FormControlLabel
              value={values[index]}
              control={<Radio />}
              label={title}
              key={`feedback-${title}-${index}`}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
});

export const RenderDateTimePicker = observer(() => {
  const root = useRootContext();
  const rsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const makeSecondsZero = (str: Date) => {
    const timeText = str.toString().split(' ');
    const time = timeText[4].slice(0, -2).concat('00');
    const formatted = timeText;
    formatted[4] = time;
    const joined = formatted.join(' ');
    const newDate = new Date(joined);
    return newDate;
  };
  const changeStartDate = (val: Date) => {
    setStartDate(val);
    const formatted = makeSecondsZero(val);
    const epoch = formatted.getTime() * 1000;
    rsStore.setFilterStartDate(epoch);
  };
  const changeEndDate = (val: Date) => {
    const formatted = makeSecondsZero(val);
    const epoch = formatted.getTime() * 1000;
    if (!!rsStore.filterStartDate && rsStore.filterStartDate <= epoch){
      setError(false);
      setErrorText('');
      setEndDate(val);
      rsStore.setFilterEndDate(epoch);
    } else {
      setErrorText(locale.getString('filter.startDateMustBeEarlierThanEndDate'));
      setError(true);
    }
  };
  useEffect(() => {
    if (rsStore.filterEndDate === null && rsStore.filterStartDate === null){
      setEndDate(null);
      setStartDate(null);
    } else if (rsStore.filterStartDate && rsStore.filterEndDate){
      rsStore.setFilterBtnDisabled(false);
    } else if (rsStore.filterStartDate && !rsStore.filterEndDate){
      rsStore.setFilterBtnDisabled(true);
      setErrorText(locale.getString('filter.selectEndDateAndTime'));
      setError(true);
    } else if (rsStore.filterEndDate && !rsStore.filterStartDate){
      rsStore.setFilterBtnDisabled(true);
      setErrorText(locale.getString('filter.selectStartDateAndTime'));
      setError(true);
    } else if (!rsStore.filterEndDate && !rsStore.filterStartDate){
      rsStore.setFilterBtnDisabled(false);
      setError(false);
      setErrorText(locale.getString(''));
    }
  }, [rsStore.filterEndDate, rsStore.filterStartDate]);

  return (
    <>
      <Stack mb={1}>
        <Typography variant="overline">
          {locale.getString('reviewSessions.startDate')}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            value={startDate}
            onChange={(newValue) => {
              if (!!newValue && typeof newValue !== 'string'){
                changeStartDate(newValue);
              }
            }}
          />
        </LocalizationProvider>
      </Stack>
      <Stack>
        <Typography variant="overline">{locale.getString('reviewSessions.endDate')}</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            value={endDate}
            onChange={(newValue) => {
              if (!!newValue && typeof newValue !== 'string'){
                changeEndDate(newValue);
              }
            }}
          />
        </LocalizationProvider>
        {error &&
        <Typography variant="caption" color="error">{errorText}</Typography>
        }
      </Stack>
    </>
  );
});

export const RenderRdyFilter = observer(() => {
  const root = useRootContext();
  const rsStore: ReviewSessionsStore = root.reviewSessionsStore;
  return (
    <>
      <TextField
        id="rdy-filter"
        value={rsStore.filterRdy || ''}
        onChange={(e: ChangeEvent<HTMLInputElement>) => rsStore.setFilterRdy(e.target.value)}
        sx={{width: '100%'}}
      />
    </>
  );
});
