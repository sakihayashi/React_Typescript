import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSSProperties } from 'react';

export const WizardMainBox = styled(Box)(({theme}) => ({
  width: '100%',
  height: '100%',
  marginTop: theme.spacing(0.5),
}));

export const tableCellTextXL: CSSProperties = {
  fontSize: 24,
};
export const tableCellTextL: CSSProperties = {
  fontSize: 20,
};
export const textLlink = {
  fontSize: 20,
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase',
  },
};
export const textXXL: CSSProperties = {
  fontSize: 42,
  fontFamily: '"IBMPlexSans-SemiBold", sans-serif'
};
export const iconXXL: CSSProperties = {
  height: 75,
  width: 'auto',
  marginLeft: '-15px',
  marginBottom: '-5px'
};
export const iconS: CSSProperties = {
  height: 20,
  width: 'auto',
  marginLeft: 0.1,
};
export const CurrentSessions = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
  marginTop: '10px',
  height: 'calc(100% - 435px)',
  overflowY: 'hidden',
}));
export const CurrentAnalyzedBox = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
  marginTop: '10px',
  maxHeight: 166,
}));
export const AccordionDetailsBox = styled(Box)(({theme}) => ({
  borderTop: '1px solid #757575',
  display: 'flex'
}));

export const GridForTable = styled(Grid)({
  overflow: 'scroll',
});