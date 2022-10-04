import React from 'react';

import { observer } from 'mobx-react-lite';
import { TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Box125, FlexBox, TableCellNoBorder, TableInGrid } from '@otosense/components';

import { useRootContext } from '../../../RootStore';
import { IResultsData } from '../../../api';
import DiagnosisDetailsSection from 'Views/components/DiagnosisDetailsSection';

interface IProps {
  data: IResultsData;
}

const Diagnosis = (props: IProps) => {
  const data = props.data;
  const root = useRootContext();
  const locale = root.appState.locale;
  const appState = root.appState;
  const assetTypeStore = root.assetTypeStore;
  const pipeline = assetTypeStore.assetTypes.find(type => type.name === data.asset_type).variants.find(variant => variant._id === data.asset_variant).channels.find(channel => channel._id === data.channel_id);
  return (
    <TableInGrid>
      <TableHead>
        <TableRow>
          <TableCell sx={{backgroundColor: 'transparent'}}>
            <Typography variant="body2" color="inherit">{locale.getString('testing.diagnosis')}</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCellNoBorder>
            {pipeline.dpp_build_time &&
                  <FlexBox >
                    <Box125>{locale.getString('testing.dppUpdated')}</Box125>:
                    <Typography variant="h4" ml={0.5}>{appState.formatSessionTime(pipeline.dpp_build_time)}</Typography>
                  </FlexBox>
            }
            <FlexBox>
              <Box125>
                {locale.getString('global.score')}
              </Box125>:
              <Typography variant="h4" component="span" ml={0.5}>
                {typeof data.quality_score !== 'string' ? data.quality_score.toFixed(1) : data.quality_score}
              </Typography>
            </FlexBox>
            {!!data &&
            <FlexBox sx={{alignItems: 'baseline'}}>
              <Box125>{locale.getString('literals.details')}</Box125>:
              <Typography variant="h4" component="span">
                <DiagnosisDetailsSection data={data}/>
              </Typography>
            </FlexBox>
            }
          </TableCellNoBorder>
        </TableRow>
      </TableBody>
    </TableInGrid>
  );
};

export default observer(Diagnosis);
