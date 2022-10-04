import React, { useEffect } from 'react';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, Radio, Stack, Typography } from '@mui/material/';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { ErrorText, FlexSpaceBet, SuccessText, VirtualInputContainer } from '@otosense/components';

import { FeedbackEnum } from '../../../../api';
import { useRootContext } from '../../../../RootStore';

import { TextIconBox } from '../../../../globalStyles/otoBox';
import AutoFillComment from 'Views/components/AutoFillComment';

interface IProps {
  feedback: {passFail: FeedbackEnum, notes: string};
  changeFeedback: (state: FeedbackEnum) => void;
  changeComment: (str: string, index: number) => void;
}

const UserFeedbackSection = (props: IProps) => {
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const { feedback, changeFeedback, changeComment } = props;
  const appState = root.appState;
  const index = 0;

  const labelPass = {
    inputProps: { 'aria-label': locale.getString('reviewSessions.pass') },
  };
  const labelFail = {
    inputProps: { 'aria-label': locale.getString('reviewSessions.fail') },
  };

  useEffect(appState.addNewMoveUpStyle, []);
  return (
    <Box>
      <Typography variant="h3" component="span">{locale.getString('reviewSessions.operatorsDiagnosis')}</Typography>
      <Stack direction="row" mb={0.5} sx={{alignItems: 'center'}}>
        <Typography variant="subtitle1" sx={{textTransform: 'none'}}>
          {locale.getString('userFeedback.didThisPartPassOrFailQualityControl')}
        </Typography>
        <FlexSpaceBet sx={{alignItems: 'center'}}>
          <TextIconBox>
            <Radio
              id="Pass"
              name="feedback"
              {...labelPass}
              onChange={() => changeFeedback(FeedbackEnum.PASS)}
              checked={feedback.passFail === FeedbackEnum.PASS}
            />
            <ThumbUpIcon color="success" />
            <Typography variant="subtitle1" mr={1} sx={SuccessText}>{locale.getString('reviewSessions.pass')}</Typography>

          </TextIconBox>
          <TextIconBox>
            <Radio
              id="Fail"
              name="feedback"
              onChange={() => changeFeedback(FeedbackEnum.FAIL)}
              {...labelFail}
              checked={feedback.passFail === FeedbackEnum.FAIL}
            />
            <ThumbDownIcon color="error" />
            <Typography variant="subtitle1" sx={ErrorText}>{locale.getString('reviewSessions.fail')}</Typography>
          </TextIconBox>
        </FlexSpaceBet>
      </Stack>
      <Typography variant="overline">
        {locale.getString('userFeedback.addComments')}
      </Typography>
      <VirtualInputContainer
        touchScreenMode={appState.touchScreenMode}
        moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[index]}
        onClose={() => appState.resetMoveUpStyle(index)}
        text={locale.getString('literals.close')}
      >
        <AutoFillComment notes={feedback.notes} getFeedbackCommentMulti={changeComment} index={index} isMultiple={true} onFocus={() => appState.setMoveUpStyle(index)}/>
      </VirtualInputContainer>
    </Box>

  );
};

export default observer(UserFeedbackSection);
