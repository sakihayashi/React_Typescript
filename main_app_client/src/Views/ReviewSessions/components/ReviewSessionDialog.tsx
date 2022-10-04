import React, { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';

import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';
import UserFeedback, {
  UserFeedbackState,
} from './UserFeedback';
import ReviewSessionsStore from '../store';
import AssetTypeStore from '../../../assetTypeStore';
import apiRequest, { APIS, FeedbackEnum } from '../../../api';
import { PromiseFunction } from '../../../Utility/types';
import DataCollectionStore from '../../DataCollectionAndAnalysis/store';

import SensorData from '../../components/SensorData';
import SaveCloseBtns from '../../components/SaveCloseBtns';
import SessionDetails from '../../components/SessionDetails';
import DiagnosisSection from '../../DataCollectionAndAnalysis/screens/RecordingPlc/components/DiagnosisSection';

interface IProps {
  backToTable?: VoidFunction;
}

const ReviewSessionDialog = (props: IProps) => {
  const { backToTable } = props;
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore  = appState.locale;
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const dataCollectionStore: DataCollectionStore = root.dataCollectionStore;
  const selectedSession = reviewSessionsStore.selectedSessionState;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const score = typeof selectedSession.quality_score === 'number' ? selectedSession.quality_score : '';
  const [feedback, setFeedback] = useState({
    notes: reviewSessionsStore.selectedSessionState.notes || '',
    passFail: reviewSessionsStore.selectedSessionState.feedback || FeedbackEnum.UNSET,
  });
  const selectedChannel = assetTypeStore.assetTypes.find(type => type.name === selectedSession.asset_type).variants.find(variant => variant._id === selectedSession.asset_variant).channels.find(channel => channel.name === selectedSession.asset_channel);
  const isLearningMode =
  selectedSession.quality_score === 'N/A'
    ? locale.getString('reviewSessions.learningMode')
    : null;
  const handleFeedback = (val: UserFeedbackState) => {
    setFeedback(val);
  };

  const resetAndClose = () => {
    setFeedback({
      notes: selectedSession.notes || '',
      passFail: selectedSession.feedback || FeedbackEnum.UNSET,
    });
    reviewSessionsStore.setSelectedSessionState(null);
    dataCollectionStore.resetRecordingResults();
  };

  const storeUserFeedback: PromiseFunction = () => {
    const commentHistory: string[] = JSON.parse(localStorage.getItem('commentsHistory')) || [];
    if (!!feedback.notes){
      commentHistory.push(feedback.notes);
      const unique = Array.from(new Set(commentHistory));
      localStorage.setItem('commentsHistory', JSON.stringify(unique));
    }

    const storeFeedbackArgs = {
      feedback: feedback.passFail,
      notes: feedback.notes,
      source_set_id: selectedSession._id,
    };
    return apiRequest(APIS.STORE_FEEDBACK, storeFeedbackArgs)
      .then(reviewSessionsStore.updateCurrentPage)
      .then(resetAndClose);
  };

  if (reviewSessionsStore.loading) {
    return <div />;
  }
  return (
    <Dialog open={true} onClose={backToTable} maxWidth="md" sx={{height: '100vh'}}>
      <DialogTitle sx={{display: 'flex'}}>
        <Box sx={{'::first-letter': {textTransform: 'uppercase'}}}>{locale.getString('reviewSessions.addFeedback')}</Box>

        {isLearningMode &&
        <Alert variant="standard" color="info" sx={{height: 32, ml: 0.5, p: '0 12px', alignItems: 'center'}}>
          {isLearningMode}
        </Alert>
        }
      </DialogTitle>
      <DialogContent sx={{height: '100%'}}>
        <Box sx={{fontSize: 16}}>
          <SessionDetails data={selectedSession} fontSize="lg" dpp={typeof score === 'number'}/>
        </Box>
        <SensorData />
        {typeof score === 'number' &&
        <>
          <hr/>
          <Box mt={0} mb={0.5}>
            <Typography variant="h3" component="span" mb={0.5} mr={0.5}>
              {locale.getString('reviewSessions.otosenseDiagnosis')}
            </Typography>
            <Typography variant="subtitle1" component="span">
              {'('}
              {locale.getString('testing.dppUpdated')}{': '}
              <b>{!!selectedChannel.dpp_build_time && appState.formatSessionTime(selectedChannel.dpp_build_time)}</b>
              {')'}
            </Typography>
            <Box>
              <DiagnosisSection data={selectedSession}/>
            </Box>
          </Box>
        </>
        }

        <hr/>
        <UserFeedback
          handleFeedback={handleFeedback}
          feedback={feedback}
        />
      </DialogContent>
      <DialogActions sx={{ pl: 1}}>
        <SaveCloseBtns
          closeFunc={resetAndClose}
          saveFunc={storeUserFeedback}
          saveDisabled={false}
        />
      </DialogActions>
    </Dialog>
  );
};

export default observer(ReviewSessionDialog);
