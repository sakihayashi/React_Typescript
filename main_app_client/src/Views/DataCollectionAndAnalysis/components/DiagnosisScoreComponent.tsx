import React, { useState } from 'react';

/* eslint-disable react/prop-types */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { IResultsData, SessionResult } from '../../../api';
import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';
import { RenderFunction } from '../../../Utility/types';

import AssetInfo from './AssetInfo';
import ScoreBar from './ScoreBar';

import {
  DiagnosticsString,
  QualityScoreBox,
  ScoreExpanderButton,
  ScoreExpanderButtonLabel,
  ScoreExpanderList,
  ScoreExpanderListItem,
  ScoreExpanderListItemLabel,
} from './styles';
import { FlexBox } from '../../../globalStyles/otoBox';

interface IProps {
  results: IResultsData
}

const DiagnosisScoreComponent = (props: IProps) => {
  const { results } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  // const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  // const playbackStore = root.playbackStore;
  const [scoreExpanded, setScoreExpanded] = useState<boolean>(false);
  const { threshold, quality_score } = results;
  let isPass: boolean = true;
  let scoreDisplayText = 'N/A';

  if (
    quality_score !== 'N/A' &&
    quality_score != null &&
    !isNaN(+quality_score)
  ) {
    scoreDisplayText = `${(+quality_score).toFixed(1)}/10`;
    if (threshold == null || quality_score <= threshold) {
      isPass = false;
    }
  }

  const expandedScoreList: (
    channelScores: SessionResult['scores_per_channel']
  ) => JSX.Element = (channelScores: SessionResult['scores_per_channel']) => {
    if (scoreExpanded) {
      channelScores.sort((a, b) => (`${a.id}` > `${b.id}` ? 1 : -1));
      return (
        <ScoreExpanderList>
          {channelScores.map((channelScore: any, index: number) => {
            scoreListItem(
              channelScore.name || channelScore.id,
              channelScore.quality_score,
              index
            );
          })}
        </ScoreExpanderList>
      );
    }
  };
  const scoreListItem: (
    label: number | string,
    scoreOutOfTen: number,
    index: number
  ) => JSX.Element = (
    label: number | string,
    scoreOutOfTen: number,
    index: number
  ) => (
    <ScoreExpanderListItem key={`score-${label}-0${index}-${scoreOutOfTen}`}>
      <ScoreExpanderListItemLabel id={`score-${label}-${index}`}>
        {label}
      </ScoreExpanderListItemLabel>
      {scoreBar(scoreOutOfTen, '' + label)}
    </ScoreExpanderListItem>
  );
  const scoreBar: (scoreOutOfTen: number, label: string) => JSX.Element = (
    scoreOutOfTen: number,
    label: string
  ) => (
    <ScoreBar
      title=""
      score={+scoreOutOfTen}
      label={label}
      min={0}
      max={10}
      maxLabel={locale.getString('reviewSessions.normal')}
      minLabel={locale.getString('reviewSessions.abnormal')}
      hideArrow
    />
  );
  const expanderToggleButton: RenderFunction = () => {
    let toggle: VoidFunction;
    if (scoreExpanded) {
      // icon = 'keyboard_arrow_up';
      toggle = () => setScoreExpanded(false);
    } else {
      // icon = <KeyboardArrowDownIcon />;
      toggle = () => setScoreExpanded(true);
    }
    // TODO this can probably be an actual icon button
    return (
      <ScoreExpanderButton>
        ;
        {scoreExpanded ? (
          <KeyboardArrowUpIcon onClick={toggle} />
        ) : (
          <KeyboardArrowDownIcon onClick={toggle} />
        )}
        <ScoreExpanderButtonLabel>
          {locale.getString('reviewSessions.expand')}
        </ScoreExpanderButtonLabel>
      </ScoreExpanderButton>
    );
  };

  const expandableScore: () => JSX.Element = () => {
    let channelScores = null;
    if (
      results.session_result &&
      results.session_result.scores_per_channel &&
      results.session_result.scores_per_channel.length
    ) {
      channelScores = results.session_result;
    }
    // Remain this comment out in case as not sure what expander does
    return (
      <div>
        {/* <div className="oto-score-expander__header"> */}
        {/* <div className="oto-score-expander__label"> */}
        {scoreBar(+results.quality_score, '')}
        {/* </div> */}
        {!!channelScores && expanderToggleButton()}
        {/* </div> */}
        {!!channelScores && expandedScoreList(channelScores)}
      </div>
    );
  };

  return (
    <Box>
      {quality_score !== 'N/A' && (
        <FlexBox mb={1}>
          <Typography variant="body1">
            {locale.getString('global.qualityScore')}:
          </Typography>
          <QualityScoreBox
            sx={
              !isPass && {
                backgroundColor: 'error.main',
                color: 'error.contrastText',
              }
            }
          >
            <Typography variant="h5">{scoreDisplayText}</Typography>
          </QualityScoreBox>
          {threshold != null && (
            <DiagnosticsString>
              <div>{`${locale.getString(
                'reviewSessions.threshold'
              )}: ${threshold}`}</div>
            </DiagnosticsString>
          )}
        </FlexBox>
      )}
      <AssetInfo renderResults={results} />
      <Box mb={1} />
      {quality_score !== 'N/A' ? expandableScore() : <div />}
    </Box>
  );
};

export default observer(DiagnosisScoreComponent);
