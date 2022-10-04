describe('dummy suite', () => {
    test('dummy test', () => expect(true).toBe(true));
});

// import {
//     authToken,
//     clientID,
//     devApi,
//     testAccount,
//     testBufSize,
//     testChkSize,
//     testDeviceHwId,
//     testGroup,
//     testInteger,
//     testJWT,
//     testPassword,
//     testSr,
//     testString,
//     testWsChannel,
//     wsUrl,
// } from '../constants';
// import { sleep } from '../common';

// import { serverErrors } from '../../src/shared/constants';

// process.env.apiUrl = `${devApi}/py-api`;
// process.env.modelUrl = `${devApi}/model-api`;
// process.env.clientId = clientID;
// process.env.wsUrl = wsUrl;

// window['localStorage'] = { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() };
// import { SocketMessage } from '../../src/shared/modules/websocket';
// import AppState, { Notification } from '../../src/shared/stores/appState';

// /**
//  * TODO: List of functions
//  * idaccApiRequest - Need test params for request
//  */

// describe('AppState', () => {
//     const appState = new AppState();
//     // override dependant store

//     beforeEach(() => {
//         jest.useFakeTimers();
//     });

//     afterEach(() => {
//         appState.messages.clear();
//     });

//     test('login', (done: VoidFunction) => {
//         appState.login(testAccount, testPassword).then(() => {
//             expect(appState.loggedIn).toEqual(true);
//             done();
//         });
//     });

//     test('checkLogin', (done: VoidFunction) => {
//         const init = appState.initialize;

//         // skip over initialize
//         appState.initialize = jest.fn();
//         appState.checkLogin()
//         .then((good) => {
//             expect(good).toEqual(true);
//             expect(appState.user).toEqual(testAccount);
//             expect(appState.initialize).toHaveBeenCalledTimes(1);

//             appState.initialize = init;
//             done();
//         });
//     });

//     test('fetchUserS3Key', (done: VoidFunction) => {
//         const mockfn = jest.fn();

//         if (appState.s3) {
//             appState.s3 = undefined;
//         }

//         appState.fetchUserS3Key().then(() => {
//             expect(appState.messages.length).toEqual(0);
//             expect(appState.s3).toBeTruthy();
//             done();
//         });
//     });

//     test('setProgress', () => {
//         const event = { loaded: 25, total: 1000 };
//         expect(appState.progress).toEqual(0);
//         appState.setProgress(event);
//         expect(appState.progress).toEqual(2.5);
//     });

//     test('getUserGroup', (done: VoidFunction) => {
//         appState.getUserGroup(testAccount)
//         .then(({ group }) => {
//             expect(group).toEqual(testGroup);
//             done();
//         });
//     });

//     test('getUserAudioParams', (done: VoidFunction) => {
//         appState.user = testAccount;
//         appState.getUserAudioParams().then(() => {
//             expect(appState.audioParams).toMatchObject({
//                 bufferFrames: testBufSize,
//                 chunkBuffers: testChkSize,
//                 sampleRate: testSr,
//             });
//             expect(appState.audioParams.chunkLength).toBeCloseTo(0.9752380952380952);
//             done();
//         });
//     });

//     test('addMessage', () => {
//         const timeout = 1000;

//         // Simple add message
//         appState.addMessage({
//             message: testString,
//             type: 'success',
//         });
//         expect(appState.messages.length).toEqual(1);
//         expect(appState.messages[0].message).toEqual(testString);
//         expect(appState.messages[0].type).toEqual('success');

//         // Skip existing message
//         appState.addMessage({
//             message: testString,
//             type: 'error',
//         });
//         expect(appState.messages.length).toEqual(1);
//         expect(appState.messages[0].message).toEqual(testString);
//         expect(appState.messages[0].type).toEqual('success');

//         // Timeout is called
//         appState.addMessage({
//             message: testString + '2',
//             type: 'any',
//         }, timeout);
//         expect(appState.messages.length).toEqual(2);
//         expect(appState.messages[1].message).toEqual(testString + '2');
//         expect(appState.messages[1].type).toEqual('any');
//         expect(setTimeout).toHaveBeenCalledTimes(1);
//         expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), timeout);
//     });

//     test('dismissMessage', () => {
//         const item: Notification = {
//             message: testString,
//             type: 'success',
//         };
//         let pushed;

//         // Simple dismiss
//         appState.addMessage(item);
//         expect(appState.messages.length).toEqual(1);
//         pushed = appState.messages[appState.messages.length - 1];
//         appState.dismissMessage(pushed);
//         expect(appState.messages.length).toEqual(0);

//         // Dismiss 2nd of three messages
//         for (let i = 0; i < 3; i++) {
//             appState.addMessage({...item, message: item.message + i.toString()});
//         }
//         expect(appState.messages.length).toEqual(3);
//         expect(appState.messages[1].message).toEqual(testString + '1');
//         pushed = appState.messages[1];
//         appState.dismissMessage(pushed);
//         expect(appState.messages.length).toEqual(2);
//         expect(appState.messages[1].message).toEqual(testString + '2');
//     });

//     test('addSuccessMessage', () => {
//         appState.addSuccessMessage(testString);
//         expect(appState.messages.length).toEqual(1);
//         expect(appState.messages[0].message).toEqual(testString);
//         expect(appState.messages[0].type).toEqual('success');
//         expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 4000);
//         expect(setTimeout).toHaveBeenCalledTimes(1);
//     });

//     test('addErrorMessage', () => {
//         appState.addErrorMessage(testString);
//         expect(appState.messages.length).toEqual(1);
//         expect(appState.messages[0].message).toEqual(testString);
//         expect(appState.messages[0].type).toEqual('error');
//     });

//     test('injectNotificationListener', () => {
//         const message: SocketMessage = {channel: 'audio_inject'};

//         appState.injectNotificationListener(message);
//         expect(appState.messages.length).toEqual(1);
//         expect(appState.messages[0].type).toEqual('success');
//         expect(appState.messages[0].message)
//         .toMatch(/^(Your audio import finished
// successfully at )(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)( local time.)$/);
//         message.channel = 'not_audio_inject';
//         appState.injectNotificationListener(message);
//         expect(appState.messages.length).toEqual(1);
//     });

//     test('logout', () => {
//         expect(appState.loggedIn).toEqual(true);
//         appState.logout();
//         expect(appState.loggedIn).toEqual(false);
//         expect(appState.token).toEqual('');
//     });

//     test('showExportDialog', () => {
//         appState.exportDialogVisible = false;
//         appState.showExportDialog(testDeviceHwId);
//         expect(appState.exportChannel).toEqual(testDeviceHwId);
//         expect(appState.exportDialogVisible).toEqual(true);
//     });

//     test('hideExportDialog', () => {
//         appState.exportDialogVisible = true;
//         appState.hideExportDialog();
//         expect(appState.exportChannel).toEqual('');
//         expect(appState.exportDialogVisible).toEqual(false);
//     });

//     test('showTokenDialog', () => {
//         appState.tokenDialogVisible = false;
//         appState.showTokenDialog();
//         expect(appState.tokenDialogVisible).toEqual(true);
//     });

//     test('hideTokenDialog', () => {
//         appState.tokenDialogVisible = true;
//         appState.hideTokenDialog();
//         expect(appState.tokenDialogVisible).toEqual(false);
//     });

//     test('getJWT', (done: VoidFunction) => {
//         appState.getJWT(testAccount, testPassword, authToken)
//         .then(({token, tokenError}) => {
//             expect(token).toEqual(testJWT);
//             expect(tokenError).toBeFalsy();
//             done();
//         });
//     });

//     test('availableChunkSteps', () => {
//         const arr = appState.availableChunkSteps;
//         expect(arr.length).toEqual(64);
//     });
// });
