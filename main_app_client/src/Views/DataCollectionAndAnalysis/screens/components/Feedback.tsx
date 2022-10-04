import React from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Radio, Stack, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { ErrorText, FormBox, SuccessText, VirtualInputContainer } from '@otosense/components';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { useRootContext } from '../../../../RootStore';
import apiRequest, { APIS, FeedbackEnum } from '../../../../api';
import { PromiseFunction } from '../../../../Utility/types';
import AppState from '../../../../appState';

import UploadedFeedback from './UploadedFeedback';
import SaveCloseBtns from '../../../components/SaveCloseBtns';
import AutoFillComment from 'Views/components/AutoFillComment';

import { TextIconBox } from '../../../../globalStyles/otoBox';
import { font20Link, TableCellNoBorder, TableInGrid } from '../RecordingPlc/components/styles';

const Feedback = () => {
  const root = useRootContext();
  const dataCollectionStore = root.dataCollectionStore;
  // const reviewSessionsStore = root.reviewSessionsStore;
  const locale = root.appState.locale;
  const appState: AppState = root.appState;
  const tabIndex = dataCollectionStore.activeTab - 1;
  const currentData = dataCollectionStore.openedTabs[tabIndex];
  const sessionId = currentData && currentData._id;
  const labelPass = {
    inputProps: { 'aria-label': locale.getString('reviewSessions.pass') },
  };
  const labelFail = {
    inputProps: { 'aria-label': locale.getString('reviewSessions.fail') },
  };

  const pass: VoidFunction = () => {
    dataCollectionStore.replaceOpenedTabs(FeedbackEnum.PASS, 'feedback');
  };

  const fail: VoidFunction = () => {
    dataCollectionStore.replaceOpenedTabs(FeedbackEnum.FAIL, 'feedback');
  };
  const storeUserFeedback: PromiseFunction = () => {
    const commentHistory: string[] = JSON.parse(localStorage.getItem('commentsHistory')) || [];
    if (!!currentData.notes){
      commentHistory.push(currentData.notes);
      const unique = Array.from(new Set(commentHistory));
      localStorage.setItem('commentsHistory', JSON.stringify(unique));
    }
    const storeFeedbackArgs = {
      feedback: currentData.feedback,
      notes: currentData.notes,
      source_set_id: sessionId,
    };
    return apiRequest(APIS.STORE_FEEDBACK, storeFeedbackArgs)
      .then((res) => {
        dataCollectionStore.getSessionData(sessionId)
          .then((resultData) => dataCollectionStore.receiveIResultsDataAndReplace(resultData, sessionId));
        // dataCollectionStore.updateSessionHistory();
        dataCollectionStore.toggleAddFeedback();
      });
  };
  const resetAndClose = () => {
    dataCollectionStore.toggleAddFeedback();
  };
  const handleComment: (
    newVal: string
  ) => void = (newVal: string) => {
    dataCollectionStore.replaceOpenedTabs(newVal, 'notes');
  };

  const quickUserFeedback = (
    <FormBox sx={{maxHeight: 'calc(100vh - 585px)', overflow: 'scroll'}}>
      <Stack direction="row" mb={0} mt={-0.2} sx={{alignItems: 'center', zIndex: 100}}>
        <Typography variant="subtitle1" component="span" sx={{textTransform: 'none'}}>
          {locale.getString('userFeedback.choseOne')}
        </Typography>
        <TextIconBox>
          <Radio
            id="Pass"
            name="feedback"
            {...labelPass}
            onChange={pass}
            checked={currentData.feedback === FeedbackEnum.PASS}
          />
          <ThumbUpIcon color="success" sx={{marginLeft: '-8px'}} />
          <Typography variant="subtitle1" sx={SuccessText}>{locale.getString('reviewSessions.pass')}</Typography>
        </TextIconBox>
        <TextIconBox>
          <Radio
            id="Fail"
            name="feedback"
            onChange={fail}
            {...labelFail}
            checked={currentData.feedback === FeedbackEnum.FAIL}
          />
          <ThumbDownIcon color="error" sx={{marginLeft: '-8px'}} />
          <Typography variant="subtitle1" sx={ErrorText}>{locale.getString('reviewSessions.fail')}</Typography>
        </TextIconBox>
      </Stack>
      <Box>
        <Typography variant="overline">
          {locale.getString('userFeedback.addComments')}
        </Typography>
        <VirtualInputContainer
          touchScreenMode={appState.touchScreenMode}
          moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[0]}
          onClose={() => appState.resetMoveUpStyle(0)}
          text={locale.getString('literals.close')}
        >
          <AutoFillComment notes={currentData.notes}getFeedbackComment={handleComment} onFocus={() => appState.setMoveUpStyle(0)}/>
        </VirtualInputContainer>
        {/* <TextField
          placeholder={locale.getString('util.enterText')}
          sx={{ width: '100%' }}
          onChange={handleComment}
          value={currentData.notes}
          multiline
          rows={3}
        /> */}
      </Box>
      <Box sx={{textAlign: 'right', mt: 0.5}}>
        <SaveCloseBtns
          closeFunc={resetAndClose}
          saveFunc={storeUserFeedback}
        />
      </Box>
    </FormBox>
  );

  return (
    <TableInGrid sx={{tableLayout: 'fixed'}}>
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="subtitle1" color="inherit">{locale.getString('reviewSessions.feedback')}</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCellNoBorder sx={{'::first-letter': {textTransform: 'uppercase'}}}>
            {dataCollectionStore.addFeedback ?
              <>{quickUserFeedback}</>
              :
              (currentData && !!currentData.feedback || currentData.notes) ?
                <UploadedFeedback openEdit={dataCollectionStore.toggleAddFeedback}/>
                :
                <Typography variant="link" onClick={dataCollectionStore.toggleAddFeedback} sx={font20Link}>{locale.getString('reviewSessions.addFeedback')}</Typography>
            }
          </TableCellNoBorder>
        </TableRow>
      </TableBody>
    </TableInGrid>
  );
};

export default observer(Feedback);
