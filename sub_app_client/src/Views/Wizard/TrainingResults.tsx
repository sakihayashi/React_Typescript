import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useRootContext } from "../../App";
import AppState from "../../appState";
import AssetComb from "../components/AssetComb";
import ChunkScoreAggResults from "./ChunkScoreAggResults";
import OutlierScores from "./OutlierScores";
import RangeSliderMui from "./RangeSlider";
import SessionScoreAgg from "./SessionScoreAgg";
import { DppWizardStore } from ".";

export interface ErrorMsg {
  min: [boolean, string];
  max: [boolean, string];
}

export const TrainingResults = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const dppWizardStore: DppWizardStore = root.dppWizardStore;
  const locale = appState.locale;
  const panelHeaders = [
    locale.getString('wizard.outlierScores'),
    locale.getString('wizard.chunkScoreAggregationRes'),
    locale.getString('wizard.sessionScoreAggregation'),
  ];
  const [expanded, setExpanded] = useState<string>('');
  const methodOptions: string[][] = [
    [
      // Chunk Score Aggregation
      locale.getString('wizard.mean'),
      // locale.getString('wizard.min'),
      // locale.getString('wizard.max'),
      locale.getString('wizard.percentile'),
    ],
    [
      // Phase Score Aggregation
      locale.getString('wizard.mean'),
      // locale.getString('wizard.min'),
      // locale.getString('wizard.max'),
    ],
    [
      // Channel Score Aggregation
      locale.getString('wizard.mean'),
      // locale.getString('wizard.min'),
      // locale.getString('wizard.max'),
    ],
  ];
  const [isPercentile, setIsPercentile] = useState<boolean>(false);
  const components: JSX.Element[] = [
    <OutlierScores key={panelHeaders[0]} />,
    <ChunkScoreAggResults key={panelHeaders[1]} />,
    <SessionScoreAgg key={panelHeaders[2]} />,
  ];
  const aggMethodNames = [
    locale.getString('wizard.chunkScoreAggMethod'),
    locale.getString('wizard.phaseScoreAggMethod'),
    locale.getString('wizard.channelScoreAggMethod'),
  ];

  const aggMethodVals = [
    dppWizardStore.chunkScoreAggMethod,
    dppWizardStore.phaseScoreAggMethod,
    dppWizardStore.channelScoreAggMethod,
  ];

  const handleAccordion = (clicked: string) => {
    if (clicked === expanded) {
      setExpanded('');
    } else {
      setExpanded(clicked);
    }
  };

  const handleChange = (val: string, index: number) => {
    switch (index) {
        case 0:
            dppWizardStore.setChunkScoreAggMethod(val);
            if (val === locale.getString('wizard.percentile')) {
                setIsPercentile(true);
            } else {
                setIsPercentile(false);
            }
            break;
        case 1:
            dppWizardStore.setPhaseScoreAggMethod(val);
            break;
        case 2:
            dppWizardStore.setChannelScoreAggMethod(val);
            break;
        default:
            break;
    }
  };

  useEffect(() => {
    appState.setIsLoading(true);
    dppWizardStore
      .setTrainingSettingsApi()
      .then(dppWizardStore.recieveTrainingResults)
      .then((res) => {
        appState.setIsLoading(false);
      });

  }, []);
  
  useEffect(() => {
    document.title = locale.getString('titles.buildDppTrainingResults');

  })
  return (
    <div className="oto-wizard-content__results">
      <Typography variant="h2" mb={1}>
        {locale.getString('wizard.trainingResults')}
      </Typography>
      <AssetComb />
      <Box mb={1} />
      <div className="oto-dropdown__container oto-spacer--mt-1rem">
        {aggMethodNames.map((name, index) => (
          <FormControl key={name} sx={{ mr: 1, mb: 2 }}>
            <Typography variant="overline">{name}</Typography>
            <Select
              value={aggMethodVals[index]}
              name={name}
              placeholder={locale.getString("wizard.selectMethod")}
              onChange={(e: SelectChangeEvent) =>
                handleChange(e.target.value, index)
              }
            >
              {methodOptions[index].map((opt, i) => (
                                <MenuItem key={`method-${opt}-${i}`} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
            </Select>
          </FormControl>
        ))}
      </div>

      {isPercentile && <RangeSliderMui />}

      {panelHeaders.map((header, index) => (
        <Accordion
          key={`viz-${header}`}
          disableGutters
          expanded={expanded === header}
          onChange={() => handleAccordion(header)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {header}
          </AccordionSummary>
          <AccordionDetails>{components[index]}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default observer(TrainingResults);
