import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { RootStoreContext } from '../../App';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';
import { RenderFunction } from '../../Utility/types';
// import AddPhases from './AddPhases';
import TempPhaseInfo from './TempPhaseInfo';
import CloseOrAddNew from './CloseOrAddNew';
import ProgressStepper from './ProgressStepper';
import SelectPipeline from './SelectPipeline';
import SelectSessions from './SelectSessions';
import DppSessionsStore from './sessionStore';
import DppWizardStore, { View } from './store';
import TrainingResults from './TrainingResults';
import TrainingSettings from './TrainingSettings';
import WizardFooter from './WizardFooter';
// import { handleErrorResponse, isLoading } from './util';

export const DppWizardMain = () => {
    const root = useContext(RootStoreContext);
    const appState: AppState = root.appState;
    const locale: LocaleStore = appState.locale;
    const assetTypeStore: AssetTypeStore = root.assetTypeStore;
    const dppSessionsStore: DppSessionsStore = root.dppSessionStore;
    const dppWizardStore: DppWizardStore = root.dppWizardStore;
    const [isScroll, setIsScroll] = useState<boolean>(false);

    const renderContent: RenderFunction = (): JSX.Element => {
        switch (dppWizardStore.step) {
        case View.SELECT_PIPELINE:
            if (isScroll) {
                setIsScroll(false);
            }
            return <SelectPipeline />;
        case View.SELECT_SESSIONS:
            if (isScroll) {
                setIsScroll(false);
            }
            return <SelectSessions />;
        case View.PHASE_DEFINITIONS:
            if (isScroll) {
                setIsScroll(false);
            }
            return <TempPhaseInfo/>
            // return <AddPhases />;
        case View.TRAINING_SETTINGS:
            if (isScroll) {
                setIsScroll(false);
            }
            return <TrainingSettings />;
        case View.REVIEW_RESULTS:
            if (!isScroll) {
                setIsScroll(true);
            }
            return <TrainingResults />;
        case View.CLOSE_ADD_NEW:
            return <CloseOrAddNew />;
        default:
            return <SelectPipeline />;
        }
    };

    useEffect(() => {
    // auto select asset used in latest session
        dppSessionsStore.filteredSessions(null, null, null, null, null, null, null, 1, null)
            .then(([[latestResult]]) => {
                if (latestResult == null) {
                    return;
                }
                const latestAssetType = assetTypeStore.assetTypes
                    .find((assetType) => assetType.name === latestResult.asset_type);
                if (latestAssetType) {
                    assetTypeStore.selectAssetTypeById(latestAssetType._id);
                    assetTypeStore.selectVariantById(latestResult.asset_variant);
                    const latestChannel = assetTypeStore.selectedVariant.channels
                        .find((channel) => channel._id === latestResult.channel_id);
                    assetTypeStore.selectChannelByName(latestChannel.name);
                }
            });
    }, []);

    return (
        <>
            <h1 className="oto-text_h1">{locale.getString('wizard.buildDpp')}</h1>
            <ProgressStepper />
            <div className="oto-main__body">
                <div className={isScroll ? 'oto-wizard-content-scrollable' : 'oto-wizard-content'}>
                    {renderContent()}
                </div>
            </div>
            {!dppWizardStore.isLastStep && <WizardFooter />}
        </>
    );
};

export default observer(DppWizardMain);
