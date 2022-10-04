import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// align text and icon center
export const TextIconBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

export const FlexBox = styled(Box)({
  display: 'flex',
});

export const FormBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const FlexSpaceBet = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});

export const FormControlSelect = styled(Box)({
  height: 45,
  maxHeight: 45,
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase',
  },
});

export const CenterBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
});

export const CapitalBox = styled(Box)({
  textTransform: 'capitalize'
});

export const Box135 = styled(Box)({
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase',
  },
  width: 135,
});

export const Box150 = styled(Box)({
  width: 150,
  display: 'inline-block',
  '::first-letter': {
    textTransform: 'uppercase',
  },
});