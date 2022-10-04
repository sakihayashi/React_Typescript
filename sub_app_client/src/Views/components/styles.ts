import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const HeaderLogo = styled('img')({
  width: 'auto',
  height: '50px',
});

export const HeaderText = styled(Typography)({
  color: '#fff',
});

export const HeaderWrapper = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignContent: 'flex-start',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100vw',
  backgroundColor: '#3c4547',
});

export const HeaderLeft = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  height: '100%',
  color: '#fff',
});

export const HeaderRight = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-end',
  height: '100%',

});

export const HeaderList = styled(List)({
  backgroundColor: '#3c4547',
  color: '#fff',
  padding: 0,
  height: '100%',
});

export const CloudIconWrapper = styled(Box)({
  color: '#fff',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});
export const cloudIconStyle = {
	width: '32px',
	height: '32px',
	m: 'auto 21px',
};

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

export const HeaderTextWrapper = styled(Typography)({
  fontSize: '16px',
  lineHeight: '16px',
  display: 'block',
  marginBottom: 8,
});
export const HeaderTitle = styled('span')({
  width: 150,
  display: 'inline-block',
});
export const HeaderStyle = styled('span')({
  fontFamily: 'IBMPlexSans-SemiBold, sans-serif',
});
