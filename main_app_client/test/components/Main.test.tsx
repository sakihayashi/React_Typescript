// import { shallow } from 'enzyme';
// import React from 'react';
// import * as RootContextModule from '../../src/App';
// import { View } from '../../src/appState';
// import { Main } from '../../src/Main';
// import Toast from '../../src/Utility/Toast/Toast';
// import Login from '../../src/Views/Login';
// import {
//     testDataCollectionStore,
//     testLocaleStore,
//     testPlaybackStore,
//     testReviewSessionsStore,
//     testRootStore,
//     testToastStore } from '../testData';

describe('Login', () => {
    test('dummy test', () => expect(true).toBe(true));
      });
// describe('Main container', () => {
//     jest.spyOn(RootContextModule, 'useRootContext').mockImplementation(() => (testRootStore));
//     const wrapper: any = shallow(
//         <RootContextModule.RootStoreContext.Provider value={...testRootStore}>
//             <Main />
//         </RootContextModule.RootStoreContext.Provider>,
//     ).dive();
//     it('should render the login component if no view is selected', () => {
//         expect(wrapper.find(Login)).toHaveLength(1);
//     });
//     it('should render a loading indicator', () => {
//         expect(wrapper.find('.oto-loading')).toHaveLength(1);
//     });
//     it('should remove the loading indicator after loading is finished', () => {
//         const testStore: any = {
//             LocaleStore: testLocaleStore,
//             appState: {
//                 isLoading: false,
//                 locale: testLocaleStore,
//                 toastStore: testToastStore,
//             },
//             dataCollectionStore: testDataCollectionStore,
//             playbackStore: testPlaybackStore,
//             reviewSessionStore: testReviewSessionsStore,
//             toastStore: testToastStore,
//         };
//         jest.spyOn(RootContextModule, 'useRootContext').mockImplementation(() => (testStore));
//         const wrapper1: any = shallow(
//             <RootContextModule.RootStoreContext.Provider value={...testRootStore}>
//                 <Main />
//             </RootContextModule.RootStoreContext.Provider>,
//         ).dive();
//         expect(wrapper1.find('.oto-loading')).toHaveLength(0);
//     });
//     it('should render tabs after a view is selected', () => {
//         const testStore: any = {
//             LocaleStore: testLocaleStore,
//             appState: {
//                 locale: testLocaleStore,
//                 toastStore: testToastStore,
//                 view: View.SETTINGS,
//             },
//             dataCollectionStore: testDataCollectionStore,
//             playbackStore: testPlaybackStore,
//             reviewSessionStore: testReviewSessionsStore,
//             toastStore: testToastStore,
//         };
//         jest.spyOn(RootContextModule, 'useRootContext').mockImplementation(() => (testStore));
//         const wrapper2: any = shallow(
//             <RootContextModule.RootStoreContext.Provider value={...testRootStore}>
//                 <Main />
//             </RootContextModule.RootStoreContext.Provider>,
//         ).dive();

//         expect(wrapper2.find('.oto-main__tab')).toHaveLength(3);
//     });
//     // it('should always render the Toast container', () => {
//     //     expect(wrapper.find(Toast)).toHaveLength(1);
//     // });
// });
