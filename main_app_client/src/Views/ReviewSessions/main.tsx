import React, { useEffect } from 'react';

import { Backdrop, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../RootStore';
import AppState from '../../appState';
import AssetTypeStore from '../../assetTypeStore';
import { PromiseFunction } from '../../Utility/types';
import ReviewSessionsStore from '../ReviewSessions/store';

import ReviewSessionDialog from './components/ReviewSessionDialog';
import SessionTable from './components/SessionTable';

import { ReviewSessionContainer } from './styles';

const ReviewSessions = () => {
  const root = useRootContext();
  const playbackStore = root.playbackStore;
  const appState: AppState = root.appState;
  const assetTypeStore: AssetTypeStore = root.assetTypeStore;
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;

  useEffect(() => {
    document.title = root.appState.locale.getString('titles.reviewSessions');
  });

  /** Close session view */
  const backToTable: VoidFunction = () => {
    reviewSessionsStore.updateCurrentPage().then(() => {
      reviewSessionsStore.setSelectedSessionState(null);
    });
  };

  const handleFilter: PromiseFunction = () => {
    const assetFilter = assetTypeStore.selectedAssetType
      ? {
        asset_instance: assetTypeStore.instanceName || null, // ASSET ID
        asset_type: assetTypeStore.selectedAssetType.name, // ASSET TYPE
        asset_variant: assetTypeStore.selectedVariant?._id || null,
      }
      : null;
    const { filterFeedback } = reviewSessionsStore;

    return reviewSessionsStore.setFilters(
      null,
      null, // DATE
      assetFilter,
      null, // QUALITY SCORE
      false,
      filterFeedback, // FEEDBACK
      false
    );
  };

  useEffect(() => {
    // CRF-minor | AP | 2021-06-16
    // ReviewSession and Testing asset selection should not be the same assetTypeStore selections
    assetTypeStore.clearSelections();
    handleFilter();

  }, []);

  useEffect(() => {
    if (!reviewSessionsStore.selectedSessionState) {
      playbackStore.forceStopPlayback();
    }
  }, [reviewSessionsStore.selectedSessionState]);

  return (
    <ReviewSessionContainer>
      {reviewSessionsStore.loading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={appState.isLoading}
        >
          <CircularProgress color="inherit" size={150} />
        </Backdrop>
      ) : (
        <>
          <SessionTable />
          {!!reviewSessionsStore.selectedSessionState && (
            <ReviewSessionDialog backToTable={backToTable} />
          )}
        </>
      )}
    </ReviewSessionContainer>
  );
};

export default observer(ReviewSessions);
