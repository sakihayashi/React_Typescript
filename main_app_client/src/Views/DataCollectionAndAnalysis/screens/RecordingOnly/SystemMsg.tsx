import React from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Typography } from '@mui/material';
import { FormBox } from '@otosense/components';
import LocaleStore from '@otosense/locale';

import { useRootContext } from '../../../../RootStore';

const SystemMsg = () => {
  const root = useRootContext();
  // const appState: AppState = root.appState;
  const locale: LocaleStore = root.appState.locale;
  const dataCollectionStore = root.dataCollectionStore;
  const testStatus = root.dataCollectionStore.testStatus;
  // const [systemMsg, setSystemMsg] = useState<string>('');
  // system message
  if (testStatus && testStatus.is_recording && testStatus.is_running) {
    const num = testStatus.start_count + 1;

    if (dataCollectionStore.lastCount === 'N/A' && num === 1) {
      dataCollectionStore.setLastCount(num);
      const text = `${locale.getString('testing.acquiringData')}
              ${locale.getString('testing.forSession')} ${num}`;
      dataCollectionStore.setSystemMsg(text);
    } else if (
      dataCollectionStore.lastCount !== num &&
        dataCollectionStore.lastCount !== 'N/A'
    ) {
      dataCollectionStore.setLastCount(num);
      const text = `${locale.getString('testing.acquiringData')}
              ${locale.getString('testing.forSession')} ${num}`;
      dataCollectionStore.setSystemMsg(text);
    }
  } else if (testStatus && !testStatus.is_recording && testStatus.is_running) {
    // const num = testStatus.start_count + 1;
    if (dataCollectionStore.lastCount !== 'N/A') {
      const text = `${locale.getString('testing.pausing')}`;
      dataCollectionStore.setSystemMsg(text);
    }
  } else if (
    testStatus &&
      !testStatus.is_running &&
      !dataCollectionStore.isRecordingDone
  ) {
    const text = `${locale.getString('testing.acquisitionDone')}`;
    dataCollectionStore.setSystemMsg(text);
    dataCollectionStore.setIsRecordingDone(true);
  }
  return (
    <FormBox sx={{padding: 1, background: '#fff'}}>
      <Typography variant="overline">{locale.getString('testing.systemMessage')}</Typography>
      <Box p={1}>
        <Typography variant="h2">{dataCollectionStore.systemMsg}</Typography>
      </Box>

    </FormBox>
  );
};

export default observer(SystemMsg);