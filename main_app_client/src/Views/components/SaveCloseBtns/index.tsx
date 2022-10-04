import React from 'react';

import { Box, Button } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../../RootStore';

import { firstLetterStyle } from '../../../globalStyles/texts';

interface IProps {
  closeFunc: VoidFunction;
  saveFunc: VoidFunction;
  saveDisabled?: boolean;
  isNext?: boolean;
}

const SaveCloseBtns = (props: IProps) => {
  const { closeFunc, saveFunc, saveDisabled, isNext } = props;
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;

  return (
    <>
      <Button
        color="cancel"
        onClick={closeFunc}
        sx={{marginRight: 1}}
      >
        <Box sx={firstLetterStyle}>
          {locale.getString('literals.close')}
        </Box>
      </Button>
      <Button
        onClick={saveFunc}
        disabled={saveDisabled}
      >
        <Box sx={firstLetterStyle}>
          {!!isNext ? locale.getString('util.next') : locale.getString('literals.save')}
        </Box>
      </Button>
    </>
  );
};

export default observer(SaveCloseBtns);
