import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const SearchFooter = styled(Box)({
  position: 'absolute',
  bottom: 0,
  textAlign: 'right',
  width: '100%',
  height: '86px',
  padding: '1rem',
  backgroundColor: '#a3a6b4',
});

export const SearchHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  background: '#f3f3f3',
  padding: '18px',
});
