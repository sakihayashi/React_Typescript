import React from 'react';

import { observer } from 'mobx-react-lite';
import { Stack, Typography } from '@mui/material';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';

import { useRootContext } from '../../../../RootStore';
import { FeedbackEnum, IResultsData } from '../../../../api';

interface IProps {
  openEdit: VoidFunction;
  data?: IResultsData;
}

const UploadedFeedback = (props: IProps) => {
  const { openEdit, data } = props;
  const root = useRootContext();
  const dataCollectionStore = root.dataCollectionStore;
  let currentData: IResultsData;
  if (data){
    currentData = data;
  } else {
    currentData = dataCollectionStore.openedTabs[dataCollectionStore.activeTab -1];
  }

  return (
    <Stack direction="row" >
      {currentData &&
      <>
        <EditIcon color="primary" onClick={openEdit}/>
        {/* {currentData.is_uploaded && <CloudDoneIcon color="gray" sx={{marginRight: 0.5}}/> } */}
        {!!currentData.feedback && currentData.feedback === FeedbackEnum.PASS &&
        <ThumbUpIcon color="success" sx={{mr: 0.5}} />
        }
        {!!currentData.feedback && currentData.feedback === FeedbackEnum.FAIL &&
        <ThumbDownIcon color="error" sx={{mr: 0.5}} />
        }
        {!!currentData.notes && !!currentData.notes &&
      <Typography variant="body1" sx={{maxWidth: 240, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{currentData.notes}</Typography>
        }
      </>
      }

    </Stack>
  );
};

export default observer(UploadedFeedback);