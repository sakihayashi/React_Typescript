// import React from 'react';
//
// import { observer } from 'mobx-react-lite';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
// import { CenterBox } from '@otosense/components';
// import CloudDoneIcon from '@mui/icons-material/CloudDone';
//
// import { IResultsData } from '../../../../../../api';
// import { useRootContext } from '../../../../../../RootStore';
//
// import SensorConditionSm from 'Views/DataCollectionAndAnalysis/screens/components/SensorConditionSm';
// import UploadedFeedback from '../../../components/UploadedFeedback';
//
// import { diagnosisCell } from '../../../../components/styles';
// import { textLlink } from '../../styles';
// import { failTextS, passTextS } from '../../../../../../globalStyles/texts';
//
// const LatestSessionTable = () => {
//   const root = useRootContext();
//   const appState = root.appState;
//   const dataCollectionStore = root.dataCollectionStore;
//   const locale = root.appState.locale;
//
//   const heads = [
//     dataCollectionStore.sessionHistory.length && dataCollectionStore.sessionHistory[0]?.rdy.name ? dataCollectionStore.sessionHistory[0].rdy.name : locale.getString('testing.sessionNum'),
//     locale.getString('literals.time'),
//     locale.getString('settings.sensors'),
//     locale.getString('global.score'),
//     locale.getString('testing.result'),
//     locale.getString('testing.diagnosisDetails'),
//     locale.getString('reviewSessions.feedbackComment')
//   ];
//   const createNewTab = (data: IResultsData, sessionNum: number) => {
//     dataCollectionStore.setTabIndex({index: sessionNum, id: data._id});
//     dataCollectionStore.setOpenedTabs(data);
//     dataCollectionStore.setTabHeads(data.rdy?.value ? data.rdy.value + '' : sessionNum + '');
//   };
//   const openFeedback = (data: IResultsData, sessionNum: number) => {
//     dataCollectionStore.setTabIndex({index: sessionNum, id: data._id});
//     dataCollectionStore.toggleAddFeedback();
//     dataCollectionStore.setOpenedTabs(data);
//     dataCollectionStore.setTabHeads(data.rdy?.value ? data.rdy.value + '' : sessionNum + '');
//   };
//   return (
//     <TableContainer sx={{height: 'calc(100% - 50px)', overflowY: 'auto'}}>
//       <Table stickyHeader>
//         <TableHead>
//           <TableRow sx={{ borderBottom: '1px solid lightgray'}}>
//             <TableCell sx={{backgroundColor: '#fff'}}/>
//             {heads.map((head, i) => {
//               return (
//                 <TableCell key={head} sx={{backgroundColor: '#fff'}}>
//                   {head}
//                 </TableCell>
//               );
//             })}
//           </TableRow>
//         </TableHead>
//         <TableBody sx={{height: 'auto'}}>
//           {!!dataCollectionStore.sessionHistory?.length ? dataCollectionStore.sessionHistory.slice(0, 20).map((data, i, arr) => {
//             const sessionNum: number = arr.length - i;
//             return (
//               <TableRow key={`data-${data.bt}-${i}`} sx={{borderBottom: '1px solid lightgray'}} hover>
//                 <TableCell>
//                   {data.is_uploaded && <CloudDoneIcon color="gray" sx={{marginRight: 0.5}}/>}
//                 </TableCell>
//                 <TableCell >
//                   <Typography variant="link" onClick={()=>createNewTab(data, sessionNum)} >
//                     {data.rdy?.value ? data.rdy.value + '' : sessionNum}
//                   </Typography>
//                 </TableCell>
//                 <TableCell >
//                   {data.bt &&
//                   appState.formatSessionTime(data.bt)}
//                 </TableCell>
//                 <TableCell>
//                   {!!data.sensors?.length ?
//                     <SensorConditionSm sensors={data.sensors}/>
//                     :
//                     locale.getString('testing.noData')
//                   }
//                 </TableCell>
//                 <TableCell >
//                   {typeof data.quality_score === 'number' ?
//                     data.quality_score.toFixed(1)
//                     :
//                     data.quality_score
//                   }
//                 </TableCell>
//                 <TableCell>
//                   {data.quality_score >= 5 ? passTextS() : failTextS()}
//                 </TableCell>
//                 <TableCell sx={diagnosisCell} >
//                   { !!data.ai_msgs?.length && data.ai_msgs.map((msg) => {
//                     return (
//                       <span key={msg.bt}>{locale.getString(msg.message)}{', '}</span>
//                     );
//                   })
//                   }
//                 </TableCell>
//                 <TableCell>
//                   {data.notes || !!data.feedback ?
//                     <UploadedFeedback data={data}  openEdit={() => openFeedback(data, sessionNum)}/>
//                     :
//                     <Typography variant="link" sx={textLlink} onClick={() => openFeedback(data, sessionNum)}>{locale.getString('reviewSessions.addFeedback')}</Typography>
//                   }
//                 </TableCell>
//               </TableRow>
//             );
//           })
//             :
//             <TableRow sx={{height: 'calc(100vh - 600px)'}}>
//               <TableCell colSpan={8}>
//                 <CenterBox>{locale.getString('testing.noDataAcquired')}</CenterBox>
//               </TableCell>
//             </TableRow>
//           }
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };
//
// export default observer(LatestSessionTable);
