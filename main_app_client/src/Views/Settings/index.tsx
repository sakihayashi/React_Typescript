import React, { ChangeEvent, useEffect, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Menu, MenuItem } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { NavTab, NavTabs } from '@otosense/components';

import LocaleStore from '@otosense/locale';
import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import SettingsStore from '../../settingsStore';

import AppSettings from './AppSettings';
import AssetTypes from './AssetTypes';

import { MainContainer } from './styles';
import { FlexBox } from '../../globalStyles/otoBox';

const Settings = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;

  const subTabs: string[] = [
    'settings.testConfiguration',
    'settings.settings'
  ];
  const settingsStore: SettingsStore = root.settingsStore;
  const [selectedSubTab, setSelectedSubTab] = useState<string>(subTabs[0]);
  const [navView, setNavView] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const content = () => {
    switch (selectedSubTab) {
    case 'settings.testConfiguration':
      return <AssetTypes />;
    case 'settings.settings':
      return <AppSettings />;
    default:
      return <AssetTypes />;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleViewChange = (e: ChangeEvent<HTMLInputElement>, val: number) => {
    setNavView(val);
    setSelectedSubTab(subTabs[val]);
  };
  const subMenu: JSX.Element =
  (<Box sx={{ width: 'fit-content' }}>
    <NavTabs value={navView} onChange={handleViewChange}>
      {subTabs.map((view, i) => {
        const label =
        <Box sx={{'::first-letter': {textTransform: 'uppercase'}}}>{locale.getString(view)}</Box>;
        return (
          <NavTab key={view} label={label}/>
        );
      })}
    </NavTabs>
  </Box>);

  useEffect(() => {
    settingsStore.loadPipelineAndTestStatus();
  }, []);


  return (
    <MainContainer>
      <FlexBox component="nav" sx={{ justifyContent: 'space-between' }}>
        {subMenu}
        <Box onClick={handleClick} sx={{ mt: 1 }}>
          <MoreVertIcon />
        </Box>
        <Menu
          id="demo-positioned-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={appState.launchDppBuilder}>
            {locale.getString('settings.openDppApp')}
          </MenuItem>
        </Menu>
      </FlexBox>
      {content()}
    </MainContainer>
  );
};

export default observer(Settings);
