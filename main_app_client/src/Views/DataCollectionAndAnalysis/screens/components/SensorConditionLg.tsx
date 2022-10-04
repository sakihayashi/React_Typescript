import React, { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { NoMaxWidthTooltip, TextIconBox } from '@otosense/components';
import SignalCellularConnectedNoInternet4BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet4Bar';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularOffIcon from '@mui/icons-material/SignalCellularOff';
import InfoIcon from '@mui/icons-material/Info';

import { useRootContext } from '../../../../RootStore';
import { SensorCondition, SensorStatus } from '../../../../api';

import SeeAllSensors from '../components/SeeAllSensors';

import { iconS, iconXXL } from '../styles';

interface IProps {
  sensors: SensorCondition[];
}

const SensorConditionLg = (props: IProps) => {
  const root = useRootContext();
  const locale: LocaleStore = root.appState.locale;
  const { sensors } = props;
  const nums = sensors?.length ? sensors.map((sensor) => sensor.status) : null;

  let max: number = null;
  if (nums){
    max = Math.max(...nums);
  }
  let signal: JSX.Element = null;
  iconXXL.marginLeft = '-3px';
  const [openAll, setOpenAll] = useState<boolean>(false);
  if (max || max === 0) {
    switch (max) {
    case SensorStatus.OK:
      signal = <SignalCellularAltIcon sx={iconXXL} color="success"/>;
      break;
    case SensorStatus.WEAK:
      signal = <SignalCellularConnectedNoInternet4BarIcon sx={iconXXL} color="warning" />;
      break;
    case SensorStatus.ERROR:
      signal = <SignalCellularOffIcon sx={iconXXL} color="error" />;
      break;
    }
  }

  return (
    <>
      {signal && signal}
      {sensors?.length &&
      <NoMaxWidthTooltip title={<SeeAllSensors sensors={sensors}/>} placement="bottom" open={openAll} arrow>
        <TextIconBox
          onMouseEnter={() => setOpenAll(true)}
          onMouseLeave={() => setOpenAll(false)}
        >
          <Typography color="primary" variant="subtitle1" sx={{textDecoration: 'underline'}}>
            {locale.getString('testing.seeAll')}
          </Typography>
          <InfoIcon color="primary" sx={iconS}/>
        </TextIconBox>
      </NoMaxWidthTooltip>
      }
    </>
  );
};

export default observer(SensorConditionLg);
