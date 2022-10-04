import React from 'react';

import { Backdrop, CircularProgress } from '@mui/material';
import * as _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { MainBody, MainContainer, MainWrapper } from '@otosense/components';

import { useRootContext } from './RootStore';
import AppState, { View } from './appState';
import Toast from './Utility/Toast/Toast';
import * as ViewScreens from './Views';
import HeaderWrapper from './Views/components/Header/HeaderWrapper';
import MainMenu from './Views/components/MainMenu';

const Main = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dcStore = root.dataCollectionStore;
  const locale = appState.locale;
  let content: JSX.Element;
  let header: JSX.Element;
  let tabsHeader: JSX.Element;

  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      e.returnValue = locale.getString('general.refreshAlert'); // Legacy method for cross browser support
    }
    return true;
  };
  // if (dcStore.intervalBeCanceled){
  //   clearInterval(dcStore.testStatusIntervalId);
  // }

  switch (appState.view) {
  case View.DATA_COLLECTION_AND_ANALYSIS:
    header = <HeaderWrapper />;
    tabsHeader = <MainMenu />;
    content = <ViewScreens.DataCollection key="oto-screen-content" />;
    break;
  case View.REVIEW_SESSIONS:
    header = <HeaderWrapper />;
    tabsHeader = <MainMenu />;
    content = <ViewScreens.ReviewSessions key="oto-screen-content" />;
    clearInterval(dcStore.testStatusIntervalId);
    break;
  case View.SETTINGS:
    header = <HeaderWrapper />;
    tabsHeader = <MainMenu />;
    content = <ViewScreens.Settings key="oto-screen-content" />;
    clearInterval(dcStore.testStatusIntervalId);
    break;
  default:
    header = <HeaderWrapper />;
    tabsHeader = <MainMenu />;
    content = <ViewScreens.DataCollection key="oto-screen-content" />;
    break;
  }

  return (
    <MainWrapper>
      {appState.view === View.LOGIN ?
        <ViewScreens.Login />
        :
        <>
          {header}
          <MainContainer>
            {tabsHeader}
            <MainBody>{content}</MainBody>
          </MainContainer>
        </>
      }
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={appState.isLoading}
      >
        <CircularProgress color="inherit" size={150} />
      </Backdrop>
      <Toast />
    </MainWrapper>
  );
};

export default observer(Main);
