import { Box, Grid, TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSSProperties } from 'react';

export const textXXL: CSSProperties = {
  fontSize: 42,
  fontFamily: '"IBMPlexSans-SemiBold", sans-serif'
};
export const iconXXL: CSSProperties = {
  height: 75,
  width: 'auto',
  marginLeft: '-15px',
  marginBottom: '-5px'
};
export const iconS: CSSProperties = {
  height: 24,
  width: 'auto',
  marginLeft: 0.1,
};

export const GridForTable = styled(Grid)({
  overflow: 'scroll',
});

export const AllSessionsTableWrapper = styled(Box)(({theme}) => ({
  background: theme.palette.background.paper,
  width: '100%',
  marginTop: 12,
  height: 'calc(100% - 78px)',
}));

export const allSessionsTableContainer: CSSProperties = {
  borderTop: 1,
  borderColor: 'grey.400',
  height: 'calc(100% - 75px)',
  overflowY: 'auto'
};
export const Last10ScoresBox = styled(Box)({
  width: 400,
  height: 100,
  marginLeft: -1,
  marginTop: 0.5,
  marginRight: 0
});

export const TableCellLgSensor = styled(TableCell)({
  minWidth: '85px'
});

export const TableCellLgId = styled(TableCell)({
  minWidth: '150px'
});

export const TableCellLgTrend = styled(TableCell)({
  maxWidth: 350
});