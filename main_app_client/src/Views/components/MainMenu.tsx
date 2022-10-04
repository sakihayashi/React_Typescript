import React, { ChangeEvent, useState } from 'react';

import { Box } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import { FlexSpaceBet, NavTab, NavTabs } from '@otosense/components';

import { useRootContext } from '../../RootStore';
import AppState, { View } from '../../appState';

import ToggleTouchScreenMode from './ToggleTouchScreen';

const MainMenu = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const [navView, setNavView] = useState<number>(0);
  const VIEW_TABS: View[] = [
    View.DATA_COLLECTION_AND_ANALYSIS,
    View.REVIEW_SESSIONS,
    View.SETTINGS,
  ];
  let VIEW_TITLES = {};
  const textTesting = locale.getString('global.testing');
  const formattedTesting = textTesting.charAt(0).toUpperCase() + textTesting.slice(1);
  const textSS = locale.getString('global.storedSessions');
  const formattedSS = textSS.charAt(0).toUpperCase() + textSS.slice(1);
  const textAdmin = locale.getString('global.administration');
  const formattedAdmin = textAdmin.charAt(0).toUpperCase() + textAdmin.slice(1);
  if (appState.isLoggedInVerified) {
    VIEW_TITLES = {
      [View.DATA_COLLECTION_AND_ANALYSIS]: formattedTesting,
      [View.REVIEW_SESSIONS]: formattedSS,
      [View.SETTINGS]: formattedAdmin,
    };
  }
  const handleViewChange = (i: number) => {
    appState.setView(VIEW_TABS[i]);
    setNavView(i);
  };

  return (
    <FlexSpaceBet alignItems="center">
      <Box sx={{ width: 'fit-content' }}>
        <NavTabs
          value={navView}
          onChange={(e: ChangeEvent<HTMLInputElement>, newValue: number) => handleViewChange(newValue)}
        >
          {VIEW_TABS.map((v: View, i: number) => {
            return (<NavTab label={VIEW_TITLES[VIEW_TABS[i]]} key={VIEW_TITLES[VIEW_TABS[i]]} />);
          })}
        </NavTabs>
      </Box>
      <ToggleTouchScreenMode/>
    </FlexSpaceBet>
  );
};

export default observer(MainMenu);