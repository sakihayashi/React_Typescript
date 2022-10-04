import { ThemeProvider } from '@mui/material/styles';
import { otosenseTheme } from '@otosense/components';
import 'material-design-icons/iconfont/material-icons.css';
import React, { createContext, useContext } from 'react';
import Main from './Main';
import rootStore from './RootStore';
import './sass/main.scss';

export const RootStoreContext = createContext<typeof rootStore>(null);
export const useRootContext = () => useContext(RootStoreContext);

export const App = () => (
  <ThemeProvider theme={otosenseTheme}>
    <RootStoreContext.Provider value={rootStore}>
      <Main />
    </RootStoreContext.Provider>
  </ThemeProvider>
);

export default App;
