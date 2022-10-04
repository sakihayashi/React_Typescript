import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const HeaderLogoBox = styled('img')(({theme}) => ({
  width: 280,
  height: 'auto',
  [theme.breakpoints.down('lg')]: {
    width: 200,
  },
}));

export const HeaderLeft = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  color: '#fff',
});

export const HeaderText = styled(Typography)({
  color: '#fff',
  lineHeight: 1,
});

export const HeaderList = styled(List)({
  color: '#fff',
  padding: 0,
  height: '100%',
});
export const iconStyle = {
  color: '#fff',
  mr: 0.5,
};
export const arrowStyle = {
  color: '#fff',
  ml: 0.5,
  width: 36,
  height: 'auto'
};
export const logoutMenuStyle = {
  height: '100%',
  right: 0,
  textTransform: 'none' as const,
  '::first-letter': {
    textTransform: 'uppercase'
  },
  marginRight: '-32px',
};
export const HeaderRight = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-end',
  height: '100%',
  alignItems: 'center',
  mr: -32,
});
