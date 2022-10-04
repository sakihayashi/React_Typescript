import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const HeaderLogoBox = styled('img')({
  width: 'auto',
  height: '50px',
});

export const HeaderLeft = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  height: '100%',
  color: '#fff',
});

export const HeaderText = styled(Typography)({
  color: '#fff',
  margin: 'auto',
});

export const HeaderList = styled(List)({
  backgroundColor: '#3c4547',
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
  width: '1.2rem',
};
export const logoutMenuStyle = {
  height: '100%',
  right: 0,
  textTransform: 'capitalize' as const,
};
export const HeaderRight = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-end',
  height: '100%',
});
