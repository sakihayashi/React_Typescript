import React, { ChangeEvent } from 'react';

import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import { NavTabs, TabForTable } from '@otosense/components';
import CloseIcon from '@mui/icons-material/Close';

import { useRootContext } from '../../../../RootStore';

import LatestSessionTable from './LatestSessionTable';
import OpenedSessionTab from './OpenedSessionTab';

import { CurrentSessions } from '../../styles';

const LatestSessions = () => {
  const root = useRootContext();
  const locale = root.appState.locale;
  const dataCollectionStore = root.dataCollectionStore;
  const handleTabChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const len = dataCollectionStore.openedTabs.length;
    if (index > len){
      dataCollectionStore.setActiveTab(index - 1);
    } else {
      dataCollectionStore.setActiveTab(index);
    }
  };
  const closeTab = (i: number) => {
    dataCollectionStore.removeTab(i);
    if (dataCollectionStore.addFeedback) {
      dataCollectionStore.toggleAddFeedback();
    }
  };

  return (
    <CurrentSessions sx={{height: 'calc(100% - 410px)', overflowY: 'hidden'}}>
      <Box sx={{width: '100%', borderBottom: '1px solid lightgray', minHeight: 45}}>
        <NavTabs value={dataCollectionStore.activeTab} onChange={handleTabChange} >
          {!!dataCollectionStore.tabHeads?.length && dataCollectionStore.tabHeads.map((head, i) => {
            if (i !== 0){
              return (
                <TabForTable icon={<CloseIcon onClick={()=> closeTab(i)} />} iconPosition="end" label={locale.getString(head)} key={`header-${head}-${i}`}/>
              );
            } else {
              return (
                <TabForTable label={locale.getString(head)} key={`header-${head}-${i}`} icon={undefined} iconPosition={undefined} />
              );
            }
          })}
        </NavTabs>
      </Box>
      {dataCollectionStore.activeTab === 0 ?
        <LatestSessionTable />
        :
        dataCollectionStore.activeTab > 0 && !!dataCollectionStore.openedTabs?.length && <OpenedSessionTab/>
      }
    </CurrentSessions>
  );
};

export default observer(LatestSessions);
