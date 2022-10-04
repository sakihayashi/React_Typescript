import React, { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

import { useRootContext } from '../../../../RootStore';
import apiRequest, { APIS, FeedbackEnum, IResultsData } from '../../../../api';
import  { PromiseFunction } from '../../../../Utility/types';
import AssetTypeStore from '../../../../assetTypeStore';

import SaveCloseBtns from '../../../components/SaveCloseBtns';
import SessionDetails from '../../../components/SessionDetails';
import UserFeedbackSection from './UserFeedback';
import DiagnosisSection from '../RecordingPlc/components/DiagnosisSection';
import SensorData from 'Views/components/SensorData';

interface IProps {
  data: IResultsData;
  close: VoidFunction;
  dpp: boolean;
  index?: number;
}

const FeedbackDialog = (props: IProps) => {
  const { data, close, dpp, index } = props;
  const root = useRootContext();
  const dataCollectionStore = root.dataCollectionStore;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const rsStore = root.reviewSessionsStore;
  const [feedback, setFeedback] = useState({
    notes: !!data.notes ? data.notes : '',
    passFail: !!data.feedback ? data.feedback : FeedbackEnum.UNSET,
  });
  const dppBuiltTime = assetTypeStore.assetTypes.find(type => type.name === data.asset_type).variants.find(variant => variant._id === data.asset_variant).channels.find(channel => channel._id === data.channel_id).dpp_build_time;
  const changeFeedback = (state: FeedbackEnum) => {
    setFeedback({...feedback, passFail: state});
  };
  const changeComment = (str: string, i?: number) => {
    setFeedback({...feedback, notes: str});
    if (i){
      appState.resetMoveUpStyle(i);
    }
  };
  const locale = root.appState.locale;
  const appState = root.appState;
  const saveAndClose: PromiseFunction = () => {
    const commentHistory: string[] = JSON.parse(localStorage.getItem('commentsHistory')) || [];
    if (!!feedback.notes){
      commentHistory.push(feedback.notes);
      const unique = Array.from(new Set(commentHistory));
      localStorage.setItem('commentsHistory', JSON.stringify(unique));
    }
    const storeFeedbackArgs = {
      feedback: feedback.passFail,
      notes: feedback.notes,
      source_set_id: data._id,
    };
    return apiRequest(APIS.STORE_FEEDBACK, storeFeedbackArgs)
      .then(() => {
        dataCollectionStore.getSessionData(data._id)
          .then((resultData) => dataCollectionStore.receiveIResultsDataAndReplace(resultData, data._id));
      })
      .then(() => rsStore.setSelectedSessionState(null))
      .then(close);
  };
  const cancelAndClose = () => {
    rsStore.setSelectedSessionState(null);
    close();
  };
  useEffect(() => {
    appState.resetMoveUpStyle(index);
  }, []);
  return (
    <Dialog
      open={true}
      maxWidth="lg"
      sx={{ marginTop: 0, marginBottom: 0, '& .MuiDialog-container': {
        '& .MuiPaper-root': {
          minWidth: 768,
          maxHeight: '100vh',
        },
      },}}
    >
      <DialogTitle>
        <Typography variant="h2" component="span">
          {locale.getString('reviewSessions.addFeedback')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <SessionDetails data={data} fontSize='lg' dpp={dpp}/>
        <SensorData />
        {typeof data.quality_score === 'number' &&
        <>
          <hr />
          <Box mt={0.5} mb={1}>
            <Typography variant="h3" component="span" mb={0.5} mr={0.5}>{locale.getString('reviewSessions.otosenseDiagnosis')} </Typography>
            <Typography variant="subtitle1" component="span">
              {' ('}
              {locale.getString('testing.dppUpdated')}{': '}
              <b>{!!dppBuiltTime ? appState.formatSessionTime(dppBuiltTime) : locale.getString('global.na')}</b>
              {' )'}
            </Typography>
            <Box mt={0.5}>
              <DiagnosisSection data={data}/>
            </Box>
          </Box>
        </>
        }
        <hr />
        <Box mt={0.5}/>
        <UserFeedbackSection feedback={feedback} changeFeedback={changeFeedback} changeComment={changeComment}/>
      </DialogContent>
      <DialogActions>
        <SaveCloseBtns
          closeFunc={cancelAndClose}
          saveFunc={saveAndClose}
          saveDisabled={false}
        />
      </DialogActions>
    </Dialog>
  );
};

export default observer(FeedbackDialog);
