import React from 'react';

import { observer } from 'mobx-react-lite';
import { Stack, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Box135, FlexBox, FlexBoxBaseline, TableCellNoBorder, TableInGrid } from '@otosense/components';
import SensorsDataList from '../../components/SensorsDataList';

import { IResultsData } from '../../../api';
import { useRootContext } from '../../../RootStore';

interface IProps {
  data: IResultsData;
}

const RecordingDetails = (props: IProps) => {
  const { data } = props;
  const root = useRootContext();
  // const appState = root.appState;
  const assetTypeStore = root.assetTypeStore;
  const pipeline = assetTypeStore.assetTypes.find(type => type.name === data.asset_type).variants.find(variant => variant._id === data.asset_variant).channels.find(channel => channel._id === data.channel_id);

  const locale = root.appState.locale;
  const assetsTitles = [
    locale.getString('global.assetType'),
    // locale.getString('global.variant'),
    locale.getString('global.pipeline')
  ];
  const assetsData = [
    data.asset_type,
    // data.asset_variant,
    pipeline.name,
  ];
  return (
    <TableInGrid>
      <TableHead>
        <TableRow>
          <TableCell sx={{backgroundColor: 'transparent'}}>
            <Typography variant="body2" color="inherit">
              {locale.getString('testing.recordingDetails')}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCellNoBorder>
            {data &&
                <>
                  {assetsTitles.map((title, i) => {
                    return (
                      <FlexBoxBaseline key={title} sx={assetsData[i].length > 23 ? {marginBottom: '8px'} : {}}>
                        <Box135 >{title}</Box135>:
                        <Typography variant="h4" ml={0.5} component="span" sx={{overflowWrap: 'anywhere'}}>{assetsData[i]}</Typography>
                      </FlexBoxBaseline>
                    );
                  })}
                  {data.rdy?.name &&
                  <FlexBox >
                    <Box135>{data.rdy.name}</Box135>:
                    <Typography variant="h4" ml={0.5}>{data.rdy.value + ''}</Typography>
                  </FlexBox>
                  }
                  {/* {pipeline.dpp_build_time &&
                  <FlexBox >
                    <Box135>{locale.getString('testing.dppUpdated')}</Box135>:
                    <Typography variant="h4" ml={0.5}>{appState.formatSessionTime(pipeline.dpp_build_time)}</Typography>
                  </FlexBox>
                  } */}
                  <Stack direction="row">
                    <Box135>{locale.getString('settings.sensors')}</Box135>:
                    <SensorsDataList sensors={data.sensors}/>
                  </Stack>
                </>
            }
          </TableCellNoBorder>
        </TableRow>
      </TableBody>
    </TableInGrid>
  );
};

export default observer(RecordingDetails);
