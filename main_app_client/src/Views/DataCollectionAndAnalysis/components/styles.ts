import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const QualityScoreBox = styled(Box)(({theme}) => ({
  display: 'flex',
  backgroundColor: theme.palette.success.main,
  borderRadius: 5,
  padding: '0 8px',
  marginLeft: 24,
}));

export const InfoBox = styled(Typography)(({theme}) => ({
  backgroundColor: theme.palette.info.main,
  marginBottom: 16,
}));

export const UserFeedbackActions = styled(Box)({
  textAlign: 'right',
  width: '100%',
  marginTop: 16,
});

export const ScoreExpanderList = styled(Box)({
  marginTop: 10,
  marginBottom: 14,
});

export const ScoreExpanderListItem = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  marginRight: 60,
});

export const ScoreExpanderButton = styled(Box)({
  display: 'flex',
  position: 'relative',
  flexFlow: 'column nowrap',
  alignContent: 'space-around',
  justifyContent: 'space-around',
});

export const ScoreExpanderButtonLabel = styled(Box)({
  position: 'absolute',
  top: 36,
  width: '100%',
  margin: '0 auto',
  fontSize: 12,
  textAlign: 'center',
});

export const ScoreExpanderListItemLabel = styled('label')({
  width: 180,
  paddingRight: 10,
  fontWeight: 'bold',
  textAlign: 'right',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export const DiagnosticsString = styled(Box)({
  display: 'flex',
  flexFlow: 'column nowrap',
  alignContent: 'center',
  marginLeft: '1rem',
  textTransform: 'none',
  ':first-letter': {
    textTransform: 'uppercase'
  }
});

export const RecordingContainer = styled(Box)(({theme}) => ({
  // [theme.breakpoints.up('lg')]: {
  //   width: '100%',
  // },
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
}));

export const LinerProgressStyle = {
  width: 'calc(100% + 48px)',
  marginLeft: -1,
  marginTop: -1,
};
export const NoDpp = styled(Box)({
  width: '100%',
  marginTop: '3rem',
  fontSize: 24,
  textAlign: 'center',
});

export const FillerBox = styled(Box)({
  height: '100%',
  borderRadius: 'inherit',
  background: '#4db182',
});

export const ScoreContainer = styled(Box)({
  width: '100%',
});
export const ScoreBarBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    height: '8px',
    borderRadius: '7px',
  },
}));

export const ScoreBarMax = styled(Box)(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    minWidth: 112,
  },

  textAlign: 'right',
}));

export const ScoreBarMin = styled(Box)(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    minWidth: 112,
  },
}));

export const ScoreBarInline = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  marginBottom: '14px',
  verticalAlign: 'middle',
});

export const ScoreValueSpacer = styled(Box)(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    marginLeft: '20px',
  },

  display: 'flex',
  position: 'absolute',
  flexFlow: 'column nowrap',
  alignItems: 'flex-end',
}));

export const ScoreValue = styled(Box)(({theme}) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
}));

export const ScoreArrowNum = styled(Box)(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    marginLeft: '40px',
  },

  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  fontWeight: 'bold',
}));

export const UlNoM = styled('ul')({
  margin: 0,
});

// steppers
export const StepperText = styled(Typography)(({theme}) => ({
  fontSize: 24,
}));

export const OtoStepper = styled(Grid)(({theme}) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
  padding: theme.spacing(1)
}));

export const OtoCheck = styled(Box)(({theme}) => ({
  padding: '0 5px',
  color: theme.palette.grey[700],
}));

export const OtoComplete = {
  color: 'primary.main',
  fontWeight: 'bolder',
  marginRight: '5px',
};

export const OtoImcomplete = {
  color: 'grey[700]',
  fontWeight: 'lighter',
  marginBottom: 0,
  marginRight: '5px',
};

export const OtoHilighted = {
  color: 'accent.main',
  fontWeight: 'bolder',
  marginRight: '5px',
};

export const OtoStepLine = {
  width: '100%',
  height: 0,
  marginTop: '14px',
  borderTop: '1px solid #555'
};

export const OtoStepCheck = {
  display: 'flex',
  marginBottom: '5px',
};

export const StepperIconStyle = {
  width: 28,
  height: 28,
};

export const diagnosisCell: CSSProperties = {
  maxWidth: 250,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  fontSize: 20,
};