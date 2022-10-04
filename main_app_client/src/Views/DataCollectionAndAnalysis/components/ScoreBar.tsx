import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Typography } from '@mui/material';
import * as React from 'react';
import {
  FillerBox,
  ScoreArrowNum,
  ScoreBarBox,
  ScoreBarInline,
  ScoreBarMax,
  ScoreBarMin,
  ScoreContainer,
  ScoreValue,
  ScoreValueSpacer,
} from './styles';

interface IScoreProps {
  title: string;
  label: string;
  score: number;
  min: number;
  minLabel: string;
  max: number;
  maxLabel: string;
  onClick?: VoidFunction;
  hideArrow?: boolean;
  minColor?: string;
  maxColor?: string;
}

// interface IFillerProps {
//   id: string;
//   percentage: number;
//   color?: string;
// }

enum ScoreBarColor {
  red = '#EC407A',
  purple = '#AB47BC',
  blue = '#2196F3',
  green = '#66BB6A',
  yellow = '#FDD835',
  orange = '#FF9800',
  black = '#212121',
  white = '#F5F5F5',
  grey = '#616161',
}

const filler = (percentage: number, id: string, color: string) => {
  const style = {
    width: `${percentage}%`,
    minWidth: '10%',
    maxWidth: '90%',
  };
  if (color != null) {
    style['background'] = ScoreBarColor[color] || color;
  }
  return <FillerBox id={id} style={style} />;
};

const ScoreBar = (props: IScoreProps) => {
  const percentage: number =
    ((props.score - props.min) * 100) / (props.max - props.min);
  const scoreBarStyle: React.CSSProperties = {
    position: 'relative',
    flexGrow: 1,
    margin: 'auto',
    background: '#a9abb7',
  };
  let scoreBlock: JSX.Element;
  if (props.maxColor != null) {
    scoreBarStyle.background = ScoreBarColor[props.maxColor] || props.maxColor;
  } else {
    // scoreBarStyle = undefined;
  }
  if (props.hideArrow === true) {
    scoreBlock = (
      <ScoreValueSpacer
        // className="oto-score-value__spacer"
        sx={{ width: `${percentage}%` }}
      />
    );
  } else {
    scoreBlock = (
      <ScoreValueSpacer sx={{ width: `${percentage}%` }}>
        <ScoreArrowNum>
          <ArrowUpwardIcon />
          {props.score + ''}
        </ScoreArrowNum>
      </ScoreValueSpacer>
    );
  }
  return (
    <ScoreContainer aria-labelledby={`score-${props.label}`} mb={1}>
      <div>{props.title}</div>
      <ScoreBarInline>
        <ScoreBarMin>
          <Typography variant="body1">{props.minLabel}</Typography>
        </ScoreBarMin>
        <ScoreBarMax>
          <Typography variant="body1">{props.maxLabel}</Typography>
        </ScoreBarMax>
      </ScoreBarInline>
      <ScoreBarBox
        // className={scoreBarClassName}
        onClick={props.onClick}
        sx={scoreBarStyle}
      >
        <>
          {filler(percentage, props.title, props.minColor)}
          <ScoreValue>{scoreBlock}</ScoreValue>
        </>
      </ScoreBarBox>
    </ScoreContainer>
  );
};
export default ScoreBar;
