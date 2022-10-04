import React from 'react';

import { useRootContext } from '../../../../RootStore';
import { CenterBox } from '@otosense/components';
import LocaleStore from '@otosense/locale';

import { observer } from 'mobx-react-lite';
import { TableCell,  TableRow } from '@mui/material';

import AppState from '../../../../appState';

const NoDataAcquired = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  return (
    <TableRow sx={{height: 125}}>
      <TableCell colSpan={6}>
        <CenterBox>
          {locale.getString('testing.noDataAcquired')}
        </CenterBox>
      </TableCell>
    </TableRow>
  );
};

export default observer(NoDataAcquired);
