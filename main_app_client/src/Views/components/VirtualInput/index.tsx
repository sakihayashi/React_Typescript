import React from 'react';
import { Box } from '@mui/material';
import { closeIconStyle, virtualInputContainer, virtualInputWrapper } from './styles';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react-lite';

interface IProps {
  touchScreenMode: boolean;
  moveUpStyle: boolean;
  children: JSX.Element;
  onClose: VoidFunction;
}

const VirtualInputContainer = (props: IProps) => {
  const { touchScreenMode, children, onClose } = props;

  return (
    <>
      {touchScreenMode && props.moveUpStyle ?
        <Box sx={virtualInputWrapper}>
          <Box sx={virtualInputContainer}>
            <CloseIcon onClick={onClose} sx={closeIconStyle} />
            {children}
          </Box>
        </Box>
        :
        <Box>{children} </Box>
      }
    </>
  );
};

export default observer(VirtualInputContainer);


