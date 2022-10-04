import React from 'react';

import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';
import { ErrorText, FlexBox, SuccessText } from '@otosense/components';

import { useRootContext } from '../../../../../RootStore';
import { IResultsData, TestStatus } from '../../../../../api';

import { TitleBox70 } from './styles';
import DiagnosisDetailsSection from '../../../../components/DiagnosisDetailsSection';

interface IProps {
  data: TestStatus | IResultsData;
}

const DiagnosisSection = (props: IProps) => {
  const { data } = props;
  const root = useRootContext();
  const locale = root.appState.locale;
  const threshold = data.threshold || 5;
  const successText = (
    <Typography variant="h3" component="span" sx={SuccessText} ml={0.5}>{locale.getString('reviewSessions.pass')}</Typography>
  );
  const errorText = (
    <Typography variant="h3" component="span" sx={ErrorText} ml={0.5}>{locale.getString('reviewSessions.fail')}</Typography>
  );
  return (
    <>
      <FlexBox>
        <TitleBox70 variant="subtitle1">{locale.getString('global.score')}</TitleBox70>:
        <Typography variant="h3" component="span" ml={0.5}>{typeof data.quality_score === 'number' ? data.quality_score.toFixed(1) : data.quality_score}</Typography>

      </FlexBox>
      <FlexBox>
        <TitleBox70 variant="subtitle1">{locale.getString('testing.result')}</TitleBox70>: {' '}
        {data.quality_score >= threshold ?
          successText : errorText
        }
      </FlexBox>
      <FlexBox>
        <TitleBox70 variant="subtitle1">{locale.getString('literals.details')}</TitleBox70>:
        <Typography variant="h3" component="span">
          <DiagnosisDetailsSection data={data} />
        </Typography>
      </FlexBox>
    </>
  );
};

export default observer(DiagnosisSection);
