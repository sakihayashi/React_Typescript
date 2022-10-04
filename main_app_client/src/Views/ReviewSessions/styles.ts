import { Box, TableContainer } from '@mui/material';
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

export const ReviewSessionContainer = styled('main')({
  width: '100%',
  height: '100%',
});

export const PaginationIconContainer = styled('span')({
  verticalAlign: 'middle',
  cursor: 'pointer',
});

export const PlaybackContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 0.5,
  borderRadius: 4,
  height: 30,
});

export const PlaybackRow = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
});

export const ReviewSessionsTableContainer = styled(TableContainer)({
  height: 'calc(100vh - 286px)',
  overflow: 'auto',
  ml: -1,
  mr: -1,
  borderTop: '1px solid #eee',
  width: 'calc(100% + 48px)'
});