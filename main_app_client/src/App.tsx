import React from 'react';

import { otosenseTheme2022 } from '@otosense/components';

import { ThemeProvider } from '@mui/material/styles';

import 'material-design-icons/iconfont/material-icons.css';
import './globalStyles/fonts.css';
import './globalStyles/charts.css';

import Main from './Main';
import rootStore, { RootStoreContext } from './RootStore';

const App = () => {
  return (
    <ThemeProvider theme={otosenseTheme2022}>
      <RootStoreContext.Provider value={rootStore}>
        <Main />
      </RootStoreContext.Provider>
    </ThemeProvider>
  );
};

export default App;
