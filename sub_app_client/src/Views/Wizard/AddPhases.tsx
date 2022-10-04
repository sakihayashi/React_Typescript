import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Button,
  FormControl,
  IconButton,
  List,
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
import { FormBox } from "../../globalStyles/Boxes";
import { COMPARISON_LABELS } from "./store";
import { DppSessionsStore, DppWizardStore } from ".";

export const AddPhases = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const dppSessionStore: DppSessionsStore = root.dppSessionStore;
  const locale: LocaleStore = appState.locale;
  const operatorOpts = [
    {
      label: locale.getString(COMPARISON_LABELS['<']),
      value: '<',
    },
    {
      label: locale.getString(COMPARISON_LABELS['==']),
      value: '==',
    },
    {
      label: locale.getString(COMPARISON_LABELS['>']),
      value: '>',
    },
  ];
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

  const parameterRenderKeys = useMemo(
    () => dppWizardStore.selectedPhase.map(() => Math.random()),
    [dppWizardStore.selectedPhase.length],
  );

  return (
    <>
      {!dppWizardStore.availableKeys.length && (
        <div className="oto-wizard__temporal-screenlock">
          <div className="oto-wizard__no-plc">
            PLC not in use. Hit next to continue.
          </div>
        </div>
      )}
      <header className="oto-text_h2 oto-spacer--mb-125rem">
        {locale.getString('wizard.addPhaseDefinitions')}
      </header>
      <div className="oto-phase-definitions-container">
        <section className="oto-phase-list">
          <header className="oto-phase-items-header">
            <h3 className="oto-phases__list-title">
              {locale.getString('wizard.listOfPhases')}
            </h3>
          </header>
          <List className="oto-phase-list-inner">
            {dppWizardStore.phases.map((phase, index) => (
              <ListItemButton
                key={index}
                className={`oto-phase-item ${
                  index === dppWizardStore.selectedPhaseIndex
                    ? ' oto-selected'
                    : ''
                }`}
                onClick={() => dppWizardStore.selectPhase(index)}
              >
                {locale.getString('literals.phase')} {index + 1}
              </ListItemButton>
            ))}
          </List>
          <div className="oto-phase-item-btn oto-actions">
            <Button
              variant="text"
              color="secondary"
              sx={{ width: '50%', borderRight: '1px solid #a3a6b4' }}
              disabled={dppWizardStore.phases.length < 2 ? true : false}
              startIcon={<RemoveIcon />}
              onClick={dppWizardStore.removePhase}
            >
              {locale.getString('literals.remove')}
            </Button>
            <Button
              variant="text"
              color="secondary"
              sx={{ width: '50%' }}
              onClick={dppWizardStore.addPhase}
              startIcon={<AddIcon />}
            >
              {locale.getString('literals.add')}
            </Button>
          </div>
        </section>
        <section className="oto-parameters">
          <header className="oto-params-header">
            <h3 className="oto-phase-h3">
              {locale.getString('literals.phase')}{' '}
              {dppWizardStore.selectedPhaseIndex + 1}
            </h3>
            <div>
              {dppSessionStore.totalFilteredSessions}{' '}
              {locale.getString(
                dppSessionStore.totalFilteredSessions === 1
                  ? 'wizard.sessionFound'
                  : 'wizard.sessionsFound',
              )}
            </div>
          </header>
          <div>
            {dppWizardStore.selectedPhase.map((item, index) => (
              <div key={parameterRenderKeys[index]} className="oto-params-item">
                <FormBox>
                  <Typography variant="overline">
                    {locale.getString('wizard.plcTag')}
                  </Typography>
                  <FormControl size="small">
                    <Select
                      name="tag"
                      value={item.tag}
                      onChange={(e: SelectChangeEvent) =>
                        dppWizardStore.updateParameter(index, {
                          key: e.target.value,
                        })
                      }
                    >
                      {dppWizardStore.availableKeys &&
                        dppWizardStore.availableKeys.map((key, i) => (
                          <MenuItem key={`key-${key}-${i}`} value={key.tag}>
                            {key.tag}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </FormBox>
                <FormBox>
                  <Typography variant="overline">operator</Typography>
                  <FormControl size="small">
                    <Select
                      id="operator"
                      name="operator"
                      value={item.operator}
                      onChange={(e: SelectChangeEvent) =>
                        dppWizardStore.updateParameter(index, {
                          operator: e.target.value,
                        })
                      }
                    >
                      {operatorOpts.map((opt, i) => (
                        <MenuItem
                          key={`opt-${opt.label}-${i}`}
                          value={opt.value}
                        >
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormBox>
                <FormBox>
                  <Typography variant="overline">
                    {locale.getString('value')}
                  </Typography>
                  <TextField
                    size="small"
                    name="value"
                    value={'' + item.value}
                    type="number"
                    onChange={(e) =>
                      dppWizardStore.updateParameter(index, {
                        value: e.target.value,
                      })
                    }
                  />
                </FormBox>
                <IconButton
                  onClick={() => dppWizardStore.removeParameter(index)}
                  sx={{ mt: 0.5 }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
            <Button
              color="secondary"
              variant="text"
              sx={{
                width: '100%',
                height: 100,
                bgcolor: '#fff',
              }}
              startIcon={<AddIcon />}
              onClick={dppWizardStore.addParameter}
            >
              {locale.getString('literals.add')}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default observer(AddPhases);
