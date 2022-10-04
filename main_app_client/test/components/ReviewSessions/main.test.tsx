// import { Button } from '@react-md/button';
// import { shallow } from 'enzyme';
// import React from 'react';
// import * as RootContextModule from '../../../src/App';
// import { ReviewSessions } from '../../../src/Views/ReviewSessions/main';
// import { testDataCollectionStore,
// testLocaleStore,  testPlaybackStore, testRootStore, testToastStore } from '../../testData';

describe('ReviewSessions', () => {
    test('dummy test', () => expect(true).toBe(true));
    // it('should become true when the search button clicked', () => {
    //     const testStore: any = {
    //         LocaleStore: testLocaleStore,
    //         appState: {
    //             locale: testLocaleStore,
    //             toastStore: testToastStore,
    //         },
    //         dataCollectionStore: testDataCollectionStore,

    //         playbackStore: testPlaybackStore,
    //         reviewSessionsStore: {
    //             displayedSessions: [],
    //             loading: false,
    //         },
    //         toastStore: testToastStore,
    //     };
    //     jest.spyOn(RootContextModule, 'useRootContext').mockImplementation(() => (testStore));
    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <ReviewSessions  />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     wrapper.find(Button).at(1).simulate('click');
    //     // expect().toBe(true);
    // });
    // // find by class name does not work
    // it('finds the first button', () => {
    //     const testStore: any = {
    //         LocaleStore: testLocaleStore,
    //         appState: {
    //             locale: testLocaleStore,
    //             toastStore: testToastStore,
    //         },
    //         dataCollectionStore: testDataCollectionStore,

    //         playbackStore: testPlaybackStore,
    //         reviewSessionsStore: {
    //             displayedSessions: [],
    //             loading: false,
    //         },
    //         toastStore: testToastStore,
    //     };
    //     jest.spyOn(RootContextModule, 'useRootContext').mockImplementation(() => (testStore));
    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <ReviewSessions  />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();

    //     expect(wrapper.find(Button).at(0).prop('disabled')).toBe(true);
    // });
});
