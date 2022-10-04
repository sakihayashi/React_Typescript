import React, { useEffect, useState } from 'react';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  IconButton,
  TableCell,
  TableRow,
} from '@mui/material';
import { get } from 'lodash';
import { observer } from 'mobx-react-lite';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LocaleStore from '@otosense/locale';
import { CenterBox } from '@otosense/components';

import {FeedbackEnum, IResultsData} from '../../../api';
import { useRootContext } from '../../../RootStore';
import AppState from '../../../appState';
import ReviewSessionsStore from '../store';

import CollapsedContents from './CollapsedContents';

import { cellComment, cellDateTime, cellIconSpacing, cellMW160 } from '../../../globalStyles/otoTable';
import { failTextS, passTextS } from '../../../globalStyles/texts';

const SessionRow = () => {
  cellDateTime.backgroundColor = 'transparent';
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = root.appState.locale;
  const playbackStore = root.playbackStore;
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;
  // const [opens, setOpens] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false]);

  const handleOpens = (i: number) => {
    const temp = [...reviewSessionsStore.expandedRows];
    temp[i] = !temp[i];
    reviewSessionsStore.setExpandedRows(temp);
  };
  const selectSession: (session: string) => void = (session: string) => {
    reviewSessionsStore
      .filteredSessions(+session, +session, null, null, null, null, true, 1)
      .then((result: any) => {
        const selectedSession: IResultsData = get(result, '[0][0]', null);
        if (selectedSession) {
          return reviewSessionsStore.sensorDataBase64(selectedSession._id)
            .then((sensorDataBase64: string[]) => {
              if (sensorDataBase64) {
                playbackStore.setBase64Data(sensorDataBase64);
                reviewSessionsStore.setSelectedSessionState(selectedSession);
              }
            });
        }
      });
  };
  // const selectforUpload: (isChecked: boolean, id: any) => void = (
  //   isChecked: boolean,
  //   id: any
  // ) => {
  //   let tempArr = toJS([...reviewSessionsStore.selectedIds]);
  //   if (isChecked) {
  //     tempArr.push(id);
  //   } else {
  //     tempArr = tempArr.filter((selectedId: string) => selectedId !== id);
  //   }
  //   const unique = Array.from(new Set(tempArr));
  //   reviewSessionsStore.replaceSelectedIds(unique);
  // };
  return (
    <>
      {reviewSessionsStore.rowsPerPage > 0 &&
        !!reviewSessionsStore.displayedSessions?.length && reviewSessionsStore.displayedSessions
        .map((data, i) => {
          const session: any = data.bt;
          const threshold = data.threshold || 5;
          return (
            <React.Fragment key={`row-${data._id}-0${i}`}>
              <TableRow sx={{width: '100%', borderBottom: '0.5px solid #ccc'}} hover>
                <TableCell sx={cellIconSpacing}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => handleOpens(i)}
                  >
                    {reviewSessionsStore.expandedRows[i] ? <KeyboardArrowUpIcon color="primary"/> : <KeyboardArrowDownIcon color="primary" />}
                  </IconButton>
                </TableCell>
                <TableCell sx={cellDateTime}>{appState.formatSessionTime(+session)}</TableCell>
                <TableCell sx={cellMW160}>{data.asset_variant}</TableCell>
                <TableCell sx={cellMW160}>
                  {typeof data.quality_score === 'string' ? data.quality_score : [data.quality_score >= threshold ?  passTextS() : failTextS()]}
                </TableCell>
                <TableCell sx={cellDateTime}>
                  {!!data.ai_msgs?.length && locale.getString(data.ai_msgs[0].message)}
                </TableCell>
                <TableCell sx={{verticalAlign: 'bottom', maxWidth: 20, paddingRight: 0}}>
                  {data.feedback === FeedbackEnum.PASS && (
                    <ThumbUpIcon color="success" key="pass-icon" />
                  )}
                  {data.feedback === FeedbackEnum.FAIL && (
                    <ThumbDownIcon color="error" key="fail-icon"/>
                  )}
                </TableCell>
                <TableCell sx={cellComment}>{data.notes}</TableCell>

                <TableCell sx={cellIconSpacing}>
                  <CenterBox>
                    <OpenInNewIcon color="primary" onClick={() => selectSession(session)}/>
                  </CenterBox>
                </TableCell>
              </TableRow>
              <CollapsedContents open={reviewSessionsStore.expandedRows[i]} data={data} />
            </React.Fragment >
          );
        })}
    </>

  );
};

export default observer(SessionRow);
