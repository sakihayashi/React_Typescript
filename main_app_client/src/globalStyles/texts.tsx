import React from 'react';

import { ErrorText, SuccessText } from '@otosense/components';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useRootContext } from '../RootStore';

export const passTextS = () => {
  const root = useRootContext();
  const locale = root.appState.locale;
  return (
    <Typography key='passTextS' sx={SuccessText}>{locale.getString('reviewSessions.pass')}</Typography>
  );
};
export const passTextTable = () => {
  const root = useRootContext();
  const locale = root.appState.locale;
  return (
    <Box sx={SuccessText}>{locale.getString('reviewSessions.pass')}</Box>
  );
};

export const failTextS = () => {
  const root = useRootContext();
  const locale = root.appState.locale;
  return (
    <Typography  key='failTextS' sx={ErrorText}>{locale.getString('reviewSessions.fail')}</Typography>
  );
};
export const failTextTable = () => {
  const root = useRootContext();
  const locale = root.appState.locale;
  return (
    <Box sx={ErrorText}>{locale.getString('reviewSessions.fail')}</Box>
  );
};
export const TextTransformNone = styled(Typography)({
  textTransform: 'none'
});

export const firstLetterStyle = {
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase',
  },
};
