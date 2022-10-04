import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSSProperties } from 'react';


export const CurrentDataContainer = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
  marginTop: '10px',
}));
