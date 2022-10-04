import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSSProperties } from 'react';

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
export const iconS: CSSProperties = {
  height: 20,
  width: 'auto',
  marginLeft: 0.1,
};