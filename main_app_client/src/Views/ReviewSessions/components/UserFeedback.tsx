import React, { useEffect } from 'react';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Radio, Stack, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { ErrorText, FlexBox, SuccessText, VirtualInputContainer } from '@otosense/components';

import { FeedbackEnum } from '../../../api';
import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';
import AutoFillComment from 'Views/components/AutoFillComment';

import { FormBox, TextIconBox } from '../../../globalStyles/otoBox';

export interface UserFeedbackState {
  notes: string;
  passFail: FeedbackEnum;
}

export interface UserFeedbackProps {
  sessionId?: number;
  notes?: string;
  feedback?: UserFeedbackState;
  handleFeedback: (props?: UserFeedbackState) => void;
}

const UserFeedback = (props: UserFeedbackProps) => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const { feedback, handleFeedback } = props;
  const index = 0;

  const pass: VoidFunction = () => {
    const temp: UserFeedbackState = {...feedback};
    temp.passFail = FeedbackEnum.PASS;
    handleFeedback(temp);
  };

  const fail: VoidFunction = () => {
    const temp: UserFeedbackState = {...feedback};
    temp.passFail = FeedbackEnum.FAIL;
    handleFeedback(temp);
  };

  const getFeedbackComment: (
    newVal: string) => void = (newVal: string) => {
    const temp: UserFeedbackState = {...feedback};
    temp.notes = newVal;
    handleFeedback(temp);
  };

  const labelPass = {
    inputProps: { 'aria-label': locale.getString('reviewSessions.pass') },
  };
  const labelFail = {
    inputProps: { 'aria-label': locale.getString('reviewSessions.fail') },
  };

  useEffect(() => {
    appState.initializeMoveUpStyle(index);
  }, []);

  return (
    <FormBox>
      <Typography variant="h3" component="span">{locale.getString('reviewSessions.operatorsDiagnosis')}</Typography>
      <FlexBox>
        <Typography variant="subtitle1" sx={{textTransform: 'none'}}>
          {locale.getString('userFeedback.didThisPartPassOrFailQualityControl')}
        </Typography>
        <Stack direction="row" ml={1} mb={0}>
          <TextIconBox>
            <Radio
              id="Pass"
              name="feedback"
              {...labelPass}
              onChange={pass}
              checked={feedback.passFail === FeedbackEnum.PASS}
            />
            <ThumbUpIcon color="success" />
            <Typography variant="subtitle1" ml={0.2} mr={1} sx={SuccessText} component="span">{locale.getString('reviewSessions.pass')}</Typography>
          </TextIconBox>
          <TextIconBox>
            <Radio
              id="Fail"
              name="feedback"
              onChange={fail}
              {...labelFail}
              checked={feedback.passFail === FeedbackEnum.FAIL}
            />
            <ThumbDownIcon color="error" />
            <Typography variant="subtitle1" ml={0.2} sx={ErrorText} component="span" >{locale.getString('reviewSessions.fail')}</Typography>
          </TextIconBox>
        </Stack>
      </FlexBox>

      <Typography variant="overline">
        {locale.getString('userFeedback.addComments')}
      </Typography>
      <VirtualInputContainer
        touchScreenMode={appState.touchScreenMode}
        moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[index]}
        onClose={() => appState.resetMoveUpStyle(index)}
        text={locale.getString('literals.close')}
      >
        <AutoFillComment notes={feedback.notes} getFeedbackComment={getFeedbackComment} onFocus={() => appState.setMoveUpStyle(index)}/>
      </VirtualInputContainer>
    </FormBox>
  );
};

export default observer(UserFeedback);
