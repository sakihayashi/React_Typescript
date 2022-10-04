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

export const textLlink: CSSProperties | {[selector: string]: CSSProperties } = {
  fontSize: 20,
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase'
  }
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
}));
export const CurrentAnalyzedBox = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
  marginTop: '10px',
}));
export const AccordionDetailsBox = styled(Box)(({theme}) => ({
  borderTop: '1px solid #757575',
  display: 'flex'
}));

export const GridForTable = styled(Grid)({
  overflow: 'scroll',
});

export const ScreenMain = styled('main')(({theme}) => ({
  width: '100%',
  height: '100%',
}));
export const WizardWrapper = styled(Box)(({theme}) => ({
  width: 'calc(100vw - ' + theme.spacing(4) + ')',
  height: 'calc(100vh - 80px)',
  maxHeight: 'calc(100vh - 80px)',
  overflowY: 'hidden',
  backgroundColor: theme.palette.background.default,
  position: 'absolute',
  top: '80px',
  left: 0,
  padding: '0 ' + theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    height: 'calc(100vh - 60px)',
    top: 60,
  },
  [theme.breakpoints.up('xl')]: {
    height: 'calc(100vh - 100px)',
    top: 100,
  },
}));