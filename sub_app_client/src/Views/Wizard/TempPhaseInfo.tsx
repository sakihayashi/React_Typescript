import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  ListItemButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { useRootContext } from "../../App";
import AppState from "../../appState";
import { toJS } from 'mobx'
import { FormBox } from "../../globalStyles/Boxes";
import { COMPARISON_LABELS } from "./store";
import { DppSessionsStore, DppWizardStore } from ".";
import AssetCombo from '../components/AssetComb';

const TempPhaseInfo = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const dppSessionStore: DppSessionsStore = root.dppSessionStore;
  const locale: LocaleStore = appState.locale;
  useEffect(() => {
    appState.setIsLoading(true);
    dppWizardStore
      .setSelectedSessionIdsApi()
      .then(dppWizardStore.fetchPlcKeys)
      .then((res) => {
        console.log('id res', res);
        appState.setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    document.title = locale.getString('titles.buildDppAddPhaseDefinitions');
  })
  return(
    <>
    <header className="oto-text_h2 oto-spacer--mb-125rem">
        {locale.getString('wizard.phaseDefinitions')}
      </header>
    {!dppWizardStore.availableKeys.length && (
        <div className="oto-wizard__temporal-screenlock">
          <div className="oto-wizard__no-plc">
            {locale.getString('wizard.plcNotInUse')}
          </div>
        </div>
      )}
    {!!dppWizardStore.availableKeys?.length &&
    <Box>
      {/* <AssetCombo/> */}
      {console.log('dppWizardStore.availableKeys', toJS(dppWizardStore.availableKeys))}
      <Table sx={{maxWidth: 400, textTransform: 'capitalize'}}>
        <TableHead>
          <TableRow>
          <TableCell>{locale.getString('wizard.phaseNum')}</TableCell>
          <TableCell>{locale.getString('literals.definition')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dppWizardStore.plcTags.TestPhase.map((phase, i) => {
            const index = i + 1;
            return(
              <TableRow>
                <TableCell>
                  {locale.getString('literals.phase') + ' ' + index} </TableCell>
                <TableCell>
                  <Typography>{phase + ''}</Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
    }
    </>
  )
}

export default observer(TempPhaseInfo)