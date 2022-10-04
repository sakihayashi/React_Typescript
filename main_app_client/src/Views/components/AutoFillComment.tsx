import React, { FocusEvent, useEffect } from 'react';

import { Autocomplete, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import ReviewSessionsStore from '../ReviewSessions/store';

interface IProps {
  notes: string;
  getFeedbackComment?: (newVal: string) => void;
  getFeedbackCommentMulti?: (val: string, index: number) => void;
  onFocus?: (index: number) => void;
  index?: number;
  isMultiple?: boolean;
}

const AutoFillComments = (props: IProps) => {
  const root = useRootContext();
  const rsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const notes = props.notes;
  const onChange = (newVal: string) => {
    if (props.isMultiple){
      props.getFeedbackCommentMulti(newVal, props.index);
    } else {
      props.getFeedbackComment(newVal);
    }

  };
  const onFocus = () => {
    if (!!props.onFocus){
      props.onFocus(props.index ? props.index : 0);
    }
  };

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('commentsHistory'));
    rsStore.setStoredComments(storedNotes);
  }, []);
  return (
    <>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={rsStore.storedComments}
        renderInput={(params) => <TextField {...params} />}
        value={notes || ''}
        onChange={(e, newVal) => {
          onChange(newVal);
        }}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
        onFocus={onFocus}
        sx={{width: '100%'}}
        className="autofill-moveup"
      />
    </>
  );
};

export default observer(AutoFillComments);