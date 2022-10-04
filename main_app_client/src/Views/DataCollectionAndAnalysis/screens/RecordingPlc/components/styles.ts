import { Box, Grid, Table, TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { CSSProperties } from 'react';

export const TextLink = styled(Box)(({theme}) => ({
  color: theme.palette.primary.main,
  textDecoration: 'underline',
  cursor: 'pointer'
}));

export const TableInGrid = styled(Table)({
  width: 'calc(100% - 16px)',
  overflow: 'scroll',
  margin: '8px'
});

export const TitleBox70 = styled(Typography)({
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase'
  },
  display: 'inline-block',
  width: 70,
});

export const font20Link: CSSProperties | { [selector: string]: CSSProperties } = {
  fontSize: 20,
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase'
  }
};
export const Capital = styled(Box)({
  textTransform: 'capitalize'
});

export const TableCellNoBorder = styled(TableCell)({
  borderBottom: 'none'
});

export const UlNoM = styled('ul')({
  margin: 0,
});

export const Box135 = styled(Box)({
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase'
  },
  width: 135,
});
