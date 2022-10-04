import React from 'react';

import { useRootContext } from '../../../../RootStore';
import LocaleStore from '@otosense/locale';

import { observer } from 'mobx-react-lite';
import { TableCell,  TableRow } from '@mui/material';

import AppState from '../../../../appState';

const NoData = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  return (
    <TableRow>
      <TableCell colSpan={8} sx={{textAlign: 'center', height: 125}}>{locale.getString('testing.noData')}</TableCell>
    </TableRow>
  );
};

export default observer(NoData);