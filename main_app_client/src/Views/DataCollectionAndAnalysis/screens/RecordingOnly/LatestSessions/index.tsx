import React, { ChangeEvent } from 'react';

import { observer } from 'mobx-react-lite';
import { NavTabs, TabForTable } from '@otosense/components';

import { useRootContext } from '../../../../../RootStore';
import { Box } from '@mui/material';

import LatestSessionTable from './LatestSessionRow';
import CloseIcon from '@mui/icons-material/Close';

import { CurrentSessions } from '../../../styles';

const LatestSessions = () => {
  const handleTabChange = (e: ChangeEvent<HTMLInputElement>, newVal: number) => {
    dataCollectionStore.setActiveTab(newVal);
  };
  const root = useRootContext();
  const dataCollectionStore = root.dataCollectionStore;
  const locale = root.localeStore;

  const closeTab = (i: number) => {
    dataCollectionStore.removeTab(i);
  };

  return (
    <CurrentSessions sx={{height: 'calc(100% - 444px)'}}>
      <Box sx={{width: '100%', borderBottom: '1px solid lightgray', minHeight: 45}}>
        <NavTabs value={dataCollectionStore.activeTab} onChange={handleTabChange} >
          {dataCollectionStore.tabHeads.map((head, i) => {
            if (i !== 0){
              return (
                <TabForTable icon={<CloseIcon onClick={()=>closeTab(i)} />} iconPosition="end" label={locale.getString(head)} key={`header-${head}-${i}`}/>
              );
            } else {
              return (
                <TabForTable label={locale.getString(head)} key={`header-${head}-${i}`} icon={undefined} iconPosition={undefined} />
              );
            }
          })}
        </NavTabs>
      </Box>
      <LatestSessionTable />
    </CurrentSessions>
  );
};

export default observer(LatestSessions);
