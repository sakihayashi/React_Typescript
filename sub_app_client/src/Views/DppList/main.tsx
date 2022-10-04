import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useRootContext } from '../../App';
import AppState from '../../appState';
import EmptyImg from '../../assets/dpp_empty_state.svg';

import { RenderFunction } from '../../Utility/types';
import AcknowledgeDialog from './AcknowledgeDialog';

const DppList = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  // const [dialogVisible, openDialog, closeDialog] = useToggle(false);
  const locale: LocaleStore = appState.locale;
  const [openDiablog, setOpenDialog] = useState<boolean>(true);

  const toggleDialog = () => {
    setOpenDialog(!openDiablog);
  };

  const startWizard = () => {
    appState.startWizard();
  };
  const headers = [
    locale.getString('global.dateAndTime'),
    locale.getString('global.assetType'),
    locale.getString('global.assetVariant'),
    locale.getString('global.assetPipeline'),
  ];

  const noDataDiv: JSX.Element = (
    <div className="oto-dpp__empty-div">
      <img src={EmptyImg} alt={locale.getString('wizard.noDppBuiltYet')} />
      <p>{locale.getString('wizard.noDppBuiltYet')}</p>
    </div>
  );

  const renderDppTable: RenderFunction = () => {
    const dppRecords = appState.dppRecords;
    const tableRows: JSX.Element[] = dppRecords.map((data, index) => (
      <TableRow key={`dpp-list-${data}-${index}`}>
        <TableCell>
          {appState.formatTimestamp(data.last_modification_date)}
        </TableCell>
        <TableCell>{data.pipeline_state.asset_type}</TableCell>
        <TableCell>{data.pipeline_state.asset_variant}</TableCell>
        <TableCell>{data.pipeline_state.asset_pipeline}</TableCell>
      </TableRow>
    ));

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={`dpp-list-header-${header}-${index}`}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{appState.dppRecords && tableRows}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  useEffect(() => {
    document.title = locale.getString('titles.dppRecords');
  });

  useEffect(() => {
    if (appState.isAgreed === false) {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  }, []);

  return (
    <div className="container oto-settings__assetContainer">
      <Typography variant="h1" mt={1}>
        {locale.getString('dpp.title')}
      </Typography>
      <div className="oto-dpp__subheader">
        <Button onClick={startWizard}>
          {locale.getString('dpp.buildDpp')}
        </Button>
      </div>
      <div className="oto-main__body oto-main__fullheight">
        <div className="oto-dpp__search-wrapper">
          <div className="oto-dpp__search-wrapper-text">
            {appState.dppRecords.length} {locale.getString('dpp.dppRecords')}
          </div>
        </div>
        {renderDppTable()}
        {!appState.dppRecords && noDataDiv}
      </div>
      <AcknowledgeDialog onClose={toggleDialog} visible={openDiablog} />
    </div>
  );
};

export default observer(DppList);
