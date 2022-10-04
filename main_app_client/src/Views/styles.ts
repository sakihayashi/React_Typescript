import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

export const LoginWrapper = styled('div')({
  display: 'flex',
  flexFlow: 'row nowrap',
  width: '100%',
});

export const LoginContainer = styled(Grid)({
  width: '100%',
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
});

export const LoginLeft = styled(Grid)({
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  width: '508px',
  display: 'flex',
  // '@media (min-wid)'
});

export const LoginRight = styled(Grid)(({theme}) => ({
  backgroundColor: theme.palette.secondary.main,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
}));

export const LoginLogo = styled('img')({
  width: 400,
  marginBottom: 24,
});

export const CoverImg = styled('img')({
  width: '100%',
});
