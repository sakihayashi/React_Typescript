import React from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Typography } from '@mui/material';

import { ErrorText, SuccessText } from '@otosense/components';
import LocaleStore from '@otosense/locale';

import { useRootContext } from '../../../../RootStore';
import AppState from '../../../../appState';

import Last10Scores from './Last10Scores';
import SensorConditionLg from './SensorConditionLg';

import { UlNoM } from '../../components/styles';
import { Last10ScoresBox } from '../styles';

export const PassOrFail = observer(() => {
  const root = useRootContext();
  const dcStore = root.dataCollectionStore;
  const locale: LocaleStore = root.appState.locale;
  let component: JSX.Element;
  if (!!dcStore.sessionHistoryHasQualityScore) {
    if (dcStore.lastSession.quality_score >= dcStore.lastSession.threshold) {
      component = <Typography variant="h1" sx={SuccessText} >{locale.getString('reviewSessions.pass')}</Typography>;
    } else {
      component = <Typography variant="h1" sx={ErrorText}>{locale.getString('reviewSessions.fail')}</Typography>;
    }
  } else {
    component = <Typography variant="h1">{dcStore.sessionHistoryQualityScoreDisplay || locale.getString('global.na')}</Typography>;
  }
  return (<>{component}</>);
});

export const ScoreTrendOrDiagnosis = observer(() => {
  const root = useRootContext();
  const dcStore = root.dataCollectionStore;
  const locale: LocaleStore = root.appState.locale;
  return (
    <>
      {dcStore.sessionHistoryHasQualityScore ?
        <Last10ScoresBox>
          <Last10Scores/>
        </Last10ScoresBox>
        :
        (
          dcStore.sessionHistoryHasAiMsgs ?
            <Typography variant="h3" component="span" >
              <UlNoM>
                {dcStore.sessionHistoryHasAiMsgs && dcStore.lastSession.ai_msgs.map((msg, i) => {
                  return (
                    <li key={`${msg.bt}-${i}`}>{locale.getString(msg.message)}</li>
                  );
                })}
              </UlNoM>
            </Typography>
            :
            <Box sx={{margin: 0, display: 'flex', alignItems: 'center'}}>
              <Typography variant="h1">{locale.getString('testing.noData')}</Typography>
            </Box>
        )
      }
    </>
  );
});

export const CurrentSessionTime = observer(() => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dcStore = root.dataCollectionStore;
  return (
    <Typography variant="h1">
      {!!dcStore.lastSession && appState.formatSessionTime(dcStore.lastSession.bt).split(',')[1]}
    </Typography>
  );
});

export const SensorConditions = observer(() => {
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const dcStore = root.dataCollectionStore;
  return (
    <>
      {dcStore.sessionHistoryHasSensors ?
        <SensorConditionLg sensors={dcStore.lastSession.sensors} />
        :
        locale.getString('testing.noData')
      }
    </>
  );
});
