import React from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Stack, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { ErrorText, FlexBox, SuccessText, TableCellNoBorder, TableInGrid } from '@otosense/components';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { useRootContext } from '../../../RootStore';
import { FeedbackEnum, IResultsData } from '../../../api';

interface IProps {
  data: IResultsData;
}

const Feedback = (props: IProps) => {
  const { data } = props;
  const root = useRootContext();
  const locale = root.appState.locale;
  return (
    <TableInGrid>
      <TableHead>
        <TableRow>
          <TableCell sx={{backgroundColor: 'transparent'}}>
            <Typography variant="body2" color="inherit">{locale.getString('global.feedback')}</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCellNoBorder>
            <Stack>
              {!!data.feedback &&
              <FlexBox>
                {data.feedback === FeedbackEnum.PASS && (
                  <>
                    <ThumbUpIcon color="success" sx={{marginRight: 0.4}} />
                    <Typography variant="subtitle1" mr={1} sx={SuccessText} component="span">{locale.getString('reviewSessions.pass')}</Typography>
                  </>

                )}
                {data.feedback === FeedbackEnum.FAIL && (
                  <>
                    <ThumbDownIcon color="error" sx={{margin: '0 8px'}}/>
                    <Typography variant="subtitle1" sx={ErrorText} component="span" >{locale.getString('reviewSessions.fail')}</Typography>
                  </>

                )}
              </FlexBox>
              }
              <Box>{data.notes}</Box>
            </Stack>
          </TableCellNoBorder>
        </TableRow>
      </TableBody>
    </TableInGrid>
  );
};

export default observer(Feedback);
