import { CSSProperties } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';

export const UnitBoxEventConfig = styled('span')({
  display: 'flex',
  alignItems: 'end',
  paddingBottom: 8,
  marginLeft: 8,
});

export const InfoIconStyle = {
  fontSize: 18,
  marginRight: '6px',
  color: 'gray.main',
  marginTop: '2px',
};

export const MainContainer = styled(Box)(({theme}) => ({
  position: 'relative',
  width: '100%',
  paddingTop: 0,
  marginTop: -16,
  paddingBottom: 24,
}));

export const SubTitleBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '1rem 0',
});

export const ViewAssetList = styled(List)(({theme}) => ({
  width: '100%',
  height: 250,
  overflowX: 'hidden',
  overflowY: 'scroll',
  backgroundColor: theme.palette.background.default,
  // tslint:disable-next-line:quotemark
  borderBottom: '1px solid ' + theme.palette.gray.main,
}));

export const TimerBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  maxHeight: 280,
});

export const SettingsBox = styled(Box)(({theme}) => ({
  width: 'auto',
  padding: '1.25rem',
  border: `1px solid ${theme.palette.gray.light}`,
  backgroundColor: theme.palette.background.default,
}));

export const selectSensorStyle: CSSProperties | {[selector: string]: CSSProperties} = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textTransform: 'none',
  '::first-letter': {
    textTransform: 'uppercase',
  },
  minWidth: '100%',
};