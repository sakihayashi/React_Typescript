import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LanguageIcon from '@mui/icons-material/Language';
import { Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LocaleStore, { LOCALES } from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useRootContext } from '../../App';
import { availableLocales } from '../../Utility/constants';
import { arrowStyle, HeaderList, iconStyle } from './headerStyles';

const HeaderLang = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const itemClicked = (opt: LOCALES) => {
    locale.setLocale(opt);
    setAnchorEl(null);
  };
  return (
    <>
      <HeaderList
        aria-label="Language settings"
        sx={{ textTransform: 'uppercase' }}
      >
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-expanded={open ? 'true' : undefined}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ height: '100%' }}
        >
          <LanguageIcon sx={iconStyle} />
          <ListItemText
            primary={
              <Typography variant="body1" sx={{ color: '#fff' }}>
                {locale.locale}
              </Typography>}
          />
          <ArrowDropDownIcon sx={arrowStyle} />
        </ListItem>
      </HeaderList>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          'role': 'listbox',
        }}
        sx={{ textTransform: 'uppercase', height: '100%' }}
      >
        {availableLocales.map((option, i) => (
          <MenuItem
            key={`header-language-${option}-${i}`}
            divider={i !== 2 ? true : false}
            sx={{
              justifyContent: "center",
              width: "100px",
              pt: 0.5,
              pb: 0.5,
            }}
            onClick={() => itemClicked(option as LOCALES)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default observer(HeaderLang);
