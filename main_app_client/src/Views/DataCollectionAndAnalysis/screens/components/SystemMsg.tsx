import React from 'react';

import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';
import { FlexBox, FormBox } from '@otosense/components';

import LocaleStore from '@otosense/locale';
import { useRootContext } from '../../../../RootStore';
import { firstLetterStyle } from 'globalStyles/texts';

const SystemMsg = () => {
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const dataCollectionStore = root.dataCollectionStore;
  const testStatus = root.dataCollectionStore.testStatus;
  const manuallyStopped = locale.getString('systemMessage.testStopped') + '';
  const recordingSession = locale.getString('systemMessage.sessionBt');
  let forSession: string;
  const getAssetInfo = locale.getString('systemMessage.autoAssetSelection');
  const plusOne = +testStatus.start_count + 1;
  const allCompleted = locale.getString('systemMessage.testComplete');

  if (!testStatus?.rdy?.value && dataCollectionStore.systemMsg === recordingSession && +testStatus.start_count !== 0 && dataCollectionStore.currentSessionN !== plusOne && dataCollectionStore.currentSessionN < plusOne && !dataCollectionStore.isRdy){
    // no rdy val, implement when recording started
    dataCollectionStore.setCurrentSessionN(plusOne);
  } else if (!!testStatus.rdy?.value && dataCollectionStore.currentRdy !== testStatus.rdy?.value && testStatus.rdy?.value !== '' && testStatus.rdy?.value !== '0') {
    dataCollectionStore.setCurrentRdy(testStatus.rdy.value);
  }
  if (!!testStatus?.rdy?.value){
    forSession = locale.getString('literals.for') + ' #' + dataCollectionStore.currentRdy;
    if (!dataCollectionStore.isRdy){
      dataCollectionStore.setIsRdy(true);
    }
  } else if (!testStatus?.rdy?.value && !!dataCollectionStore.currentSessionN && !dataCollectionStore.isRdy) {
    if (!dataCollectionStore.isRdy){
      forSession = locale.getString('literals.for') + ' #' + dataCollectionStore.currentSessionN;
    }
  } else if (dataCollectionStore.isRdy){
    forSession = locale.getString('literals.for') + ' #' + dataCollectionStore.currentRdy;
  }

  if (testStatus?.is_running && !!testStatus?.system_msgs?.length){
    const message = locale.getString(testStatus.system_msgs[testStatus.system_msgs.length -1].message);
    dataCollectionStore.setSystemMsg(locale.getString(message));
  }
  return (
    <FormBox sx={{padding: '8px', height: 'calc(100% - 16px)'}}>
      <Typography variant="overline">{locale.getString('testing.systemMessage')}</Typography>
      <FlexBox sx={{height: '100%', alignItems: 'center', justifyContent: 'flex-start'}} flexDirection="row">
        <Typography variant="h2" component="span" sx={firstLetterStyle}>
          {dataCollectionStore.testManuallyStopped ? manuallyStopped : dataCollectionStore.systemMsg}
          {' '}
          {!!dataCollectionStore.systemMsg
            && dataCollectionStore.systemMsg !== getAssetInfo
            && dataCollectionStore.systemMsg !== allCompleted
            && forSession}
        </Typography>
      </FlexBox>

    </FormBox>
  );
};

export default observer(SystemMsg);
