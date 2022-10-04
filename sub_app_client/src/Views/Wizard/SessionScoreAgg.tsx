import {MultiTimeVis} from '@otosense/multi-time-vis';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {useRootContext} from "../../App";
import {DppWizardStore} from ".";

const SessionScoreAgg = () => {
  const root = useRootContext();
  const dppWizardStore: DppWizardStore = root.dppWizardStore;

  if (dppWizardStore?.trainingResults?.quality_score) {
    return (
      <div className="oto-drawer__datavis-container">
        <div>
          <MultiTimeVis
            annotations={[]}
            channels={[dppWizardStore.sessionQualityScores]}
            channelHeight={106}
            chartType="bargraph"
            bt={0}
            leftX={0}
            maxScale={1}
            params={{}}
            rightX={1}
            tt={Object.keys(dppWizardStore.trainingResults.quality_score).length * 1e6}
            zoomable={false}
            minorTickFormat={'ss'}
          />
        </div>
      </div>
    );
  } else {
    return <div className="oto-drawer__datavis-container"/>;
  }
};

export default observer(SessionScoreAgg);
