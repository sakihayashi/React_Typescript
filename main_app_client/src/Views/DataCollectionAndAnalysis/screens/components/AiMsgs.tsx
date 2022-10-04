import React from 'react';

import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';
import { FlexBox } from '@otosense/components';

import { useRootContext } from '../../../../RootStore';
import { AIMsgs } from '../../../../api';

import { TitleBox70, UlNoM } from '../RecordingPlc/components/styles';

interface IProps {
  ai_msgs: AIMsgs[]
}
const AiMsgs = (props: IProps) => {
  const { ai_msgs } = props;
  const root = useRootContext();
  const locale = root.appState.locale;
  return (
    <FlexBox>
      <TitleBox70 variant="subtitle1">
        {locale.getString('literals.details')}
      </TitleBox70>:
      <Typography variant="h3" component="span">
        <UlNoM>
          {ai_msgs && ai_msgs.length && ai_msgs.map((msg, i) => {
            return (
              <li key={`${msg.bt}-${i}`}>{msg.message}</li>
            );
          })}
        </UlNoM>
      </Typography>
    </FlexBox>
  );
};

export default observer(AiMsgs);