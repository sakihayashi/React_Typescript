import { CSSProperties } from 'react';
import { styled } from '@mui/material/styles';
import { Collapse, TableCell } from '@mui/material';

export const cellMW160: CSSProperties = {
  maxWidth: 160,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};
export const cellComment: CSSProperties = {
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  paddingLeft: 0,
};

export const cellIconSpacing: CSSProperties = {
  paddingLeft: 0.3,
  paddingRight: 0.3,
  maxWidth: 24,
};
export const cellDateTime: CSSProperties = {
  maxWidth: 192,
  minWidth: 192,
  overflow: 'hidden',
  background: 'transparent'
};
export const cellDateTimeL: CSSProperties = {
  maxWidth: 206,
  minWidth: 206,
  overflow: 'hidden',
  background: 'transparent'
};
export const cellSensorL: CSSProperties = {
  minWidth: 80,
  maxWidth: 110,
  overflow: 'hidden',
};
export const cellScore: CSSProperties = {
  maxWidth: 43
};

export const centerTableFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: 'calc(100% - 96px)',
  position: 'fixed',
  bottom: 0,
  borderTop: '1px solid lightgray',
  background: 'white',
};

export const StyledCollapse = styled(Collapse)({
  backgroundColor: 'rgba(0,161,192, 0.05)'
});

export const TableCellNoPl = styled(TableCell)({
  paddingLeft: 0
});