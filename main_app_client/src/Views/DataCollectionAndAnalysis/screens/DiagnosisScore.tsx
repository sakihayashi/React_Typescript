// import { observer } from 'mobx-react-lite';
// import React, { useEffect } from 'react';
// import { useRootContext } from '../../../RootStore';
// import { RenderFunction } from '../../../Utility/types';
// import DiagnosisScoreComponent from '../components/DiagnosisScoreComponent';
// import UserFeedback from '../components/UserFeedback';
// import DataCollectionStore from '../store';

// const DiagnosisScore: RenderFunction = () => {
//   const root = useRootContext();
//   const dataCollectionStore: DataCollectionStore = root.dataCollectionStore;
//   useEffect(() => {
//     document.title = root.appState.locale.getString('titles.diagnosis');
//   });

//   return (
//     <div className="oto-screen-content__content--results">
//       {!!dataCollectionStore.recordingResults && (
//         <>
//           <DiagnosisScoreComponent
//             results={dataCollectionStore.recordingResults}
//           />
//           <UserFeedback
//             sessionId={dataCollectionStore.recordingResults._id}
//             callback={dataCollectionStore.nextScreen}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default observer(DiagnosisScore);
