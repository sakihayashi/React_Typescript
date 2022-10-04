import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ProgressMsg = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
  height: 110,
}));
