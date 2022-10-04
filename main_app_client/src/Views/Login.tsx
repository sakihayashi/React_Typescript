import React, { ChangeEvent, useEffect, useState } from 'react';

import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { VirtualInputContainer } from '@otosense/components';

import apiRequest, { APIS } from '../api';
import { useRootContext } from '../RootStore';
import AppState from '../appState';
import { PromiseFunction } from '../Utility/types';

import ToggleTouchScreenMode from './components/ToggleTouchScreen';
import PleaseRegisterDialog from '../Views/AppManagement/PleaseRegisterDialog';
import SoftwareUpdatingDialog from './AppManagement/SoftwareUpdatingDialog';

import ADIlogo from '../assets/OtoSense_logo_black.svg';
import TabletMan from '../assets/tablet-man.svg';
import { CoverImg, LoginLeft, LoginLogo, LoginRight } from './styles';

const Login = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  const [userObj, setUserObj] = useState({
    account: '',
    email: '',
    password: '',
  });
  const [loginDisabled, setLoginDisabled] = useState(true);
  window['loginscreen'] = this;
  const resize = { style: { fontSize: 24, padding: '5px 16px' } };
  const index = 0;

  useEffect(() => {
    document.title = root.appState.locale.getString('titles.login');
  });

  const login: PromiseFunction = () =>
    appState.login(userObj.account, userObj.email, userObj.password);

  const ready: () => boolean = () =>
    !!userObj.account && !!userObj.email && !!userObj.password;

  const loadDefaults: VoidFunction = () => {
    apiRequest(APIS.GET_DEFAULTS).then((defaults) => {
      if (!defaults || !defaults.account) {
        return;
      } else {
        setUserObj(defaults);
        setLoginDisabled(false);
      }
    });
  };
  const setFieldValue: (
    fieldName: string
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void =
    (fieldName: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUserObj({ ...userObj, [fieldName]: e.target.value });
    };

  useEffect(() => {
    when(() => appState.isOnline, loadDefaults);
    setLoginDisabled(appState.isLoading || !ready());
    appState.resetMoveUpStyle(index);
  }, []);

  return (
    <>
      <PleaseRegisterDialog />
      <SoftwareUpdatingDialog />
      <Grid container sx={{ height: '100%' }}>
        <LoginLeft item xs={6} p={1}>
          <Box>
            <LoginLogo src={ADIlogo} alt="ADI logo" />
            <Typography variant="h1" component="h1">
              {locale.getString('login.subtitle')}
            </Typography>
            <Typography variant="subtitle2" component="h2" mb={0.5}>
              {locale.getString('login.version')}: {appState.version}
            </Typography>
            <Box mb={2} textAlign="right">
              <ToggleTouchScreenMode />
            </Box>
            <Typography
              variant="subtitle1"
              mt={1}
            >
              {locale.getString('literals.account')}
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mb: 1, textTransform: 'none', '::first-letter': {textTransform: 'none'} }}>
              {userObj.account}
            </Typography>
            <Typography
              variant="subtitle1"
              mt={1}
            >
              {locale.getString('literals.email')}
            </Typography>
            <TextField
              fullWidth
              onChange={setFieldValue('email')}
              value={userObj.email}
              type="email"
              sx={{ width: '100%', mb: 1 }}
              variant="filled"
              inputProps={resize}
            />
            <Typography variant="subtitle1" mt={1}>
              {locale.getString('literals.password')}
            </Typography>
            <VirtualInputContainer
              touchScreenMode={appState.touchScreenMode}
              moveUpStyle={appState.moveUpStyle.length && appState.moveUpStyle[index]}
              onClose={() => appState.resetMoveUpStyle(index)}
              text={locale.getString('literals.close')}
            >
              <TextField
                fullWidth
                variant="filled"
                onChange={setFieldValue('password')}
                onFocus={() => appState.setMoveUpStyle(index)}
                onBlur={setFieldValue('password')}
                value={userObj.password}
                type="password"
                sx={{ width: '100%', mb: 1 }}
                inputProps={resize}
              />
            </VirtualInputContainer>
            <Button
              sx={{ mt: 1, fontFamily: 'IBMPlexSans-SemiBold', textTransform: 'capitalize'}}
              variant="contained"
              size="large"
              color="primary"
              onClick={login}
              disabled={loginDisabled}
            >
              {locale.getString('login.login')}
            </Button>
          </Box>
        </LoginLeft>
        <LoginRight item xs={6}>
          <CoverImg src={TabletMan} alt="tablet and a man" />
        </LoginRight>
      </Grid>
    </>

  );
};

export default observer(Login);
