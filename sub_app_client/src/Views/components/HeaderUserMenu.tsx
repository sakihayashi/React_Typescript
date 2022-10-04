import AccountIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import {
  arrowStyle,
  HeaderList,
  iconStyle,
  logoutMenuStyle,
} from './headerStyles';

interface IProps {
  textLogout: string;
  logout: VoidFunction;
  setCurrentTimestamp: VoidFunction;
  account: string;
}

const HeaderUserMenu = (props: IProps) => {
  const [anchorAccount, setAnchorAccount] = React.useState<null | HTMLElement>(
    null,
  );
  const { setCurrentTimestamp, logout, textLogout, account } = props;
  const openAccount = Boolean(anchorAccount);
  useEffect(() => {
    const timerID = setInterval(() => setCurrentTimestamp(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });
  return (
    <>
      <HeaderList aria-label="Account info">
        <ListItem
          button
          id="account-button"
          aria-haspopup="listbox"
          aria-expanded={openAccount ? 'true' : undefined}
          onClick={(e) => setAnchorAccount(e.currentTarget)}
          sx={{ height: '100%' }}
        >
          <AccountIcon sx={iconStyle} />
          <ListItemText
            primary={
              <Typography variant="body1" sx={{ color: '#fff' }}>
                {account}
              </Typography>}
          />
          <ArrowDropDownIcon sx={arrowStyle} />
        </ListItem>
      </HeaderList>
      <Menu
        id="account-menu"
        anchorEl={anchorAccount}
        open={openAccount}
        onClose={() => setAnchorAccount(null)}
        MenuListProps={{
          'aria-labelledby': 'account-button',
          'role': 'listbox',
        }}
        sx={logoutMenuStyle}
      >
        <MenuItem onClick={logout} sx={{ width: '168px' }}>
          {textLogout}
        </MenuItem>
      </Menu>
    </>
  );
};

export default observer(HeaderUserMenu);
