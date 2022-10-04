import React, { CSSProperties } from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const textCapitalize: React.CSSProperties = {
  textTransform: 'capitalize',
};

export const FlexRow = styled(Box)({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
});

export const FlexCol = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const FormStyle: React.CSSProperties = {
  // borderTopRightRadius: 0,
  // borderTopLeftRadius: 0,
  marginBottom: 0,
};
export const FormSelectStyle: React.CSSProperties = {
  borderTopRightRadius: 0,
  borderTopLeftRadius: 0,
  width: '150px',
};

export const rowTitle = {
  marginTop: '22px',
  width: 106,
  marginRight: 1,
  overflowWrap: 'break-word',
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase',
  },
};
export const prefix: React.CSSProperties = {
  marginTop: '22px',
  marginBottom: 0,
  marginRight: 0.5,
};

export const Subtitle = {
  margin: 1,
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase',
  },
};

export const innerContainer: CSSProperties = {
  padding: '16px 24px',
  background: 'white',
  border: '1px solid lightgray',
  margin: '16px 24px',
};
export const InnerContainer = styled(Box)(({ theme }) => ({
  padding: 16,
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.gray.light}`,
  margin: 16,
  display: 'flex',
  alignItems: 'center'
}));

export const deleteIcon: CSSProperties = {
  color: '#003965',
  marginTop: '2px',
  cursor: 'pointer',
};

export const addButton = {
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#003965',
  margin: -16,
  padding: 0,
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase',
  },
  textDecoration: 'none',
};

export const EventHandlerContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  border: `1px solid ${theme.palette.gray.light}`,
  backgroundColor: theme.palette.background.default,
}));

export const unit = {
  marginTop: '22px',
  marginLeft: 8,
};

export const AddButtonContainer = styled(Box)(({ theme }) => ({
  padding: 0,
  height: 80,
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.gray.light}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 16,
}));
