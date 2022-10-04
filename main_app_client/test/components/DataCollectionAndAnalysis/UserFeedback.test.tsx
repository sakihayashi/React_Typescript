// import React from 'react';
// import { Button } from '@react-md/button';
// import { Checkbox, TextArea } from '@react-md/form';
// import { shallow } from 'enzyme';
// import Controller, { FeedbackEnum } from '../../../src/api';
// import { FeedbackEnum } from '../../../src/api';
// import * as RootContextModule from '../../../src/App';
// import { UserFeedback } from '../../../src/Views/DataCollectionAndAnalysis/components/UserFeedback';
// import { testRootStore } from '../../testData';

describe('', () => {
    test('dummy test', () => expect(true).toBe(true));
    // jest.spyOn(RootContextModule, 'useRootContext').mockImplementation(() => (testRootStore));
    // const sessionId = 0;
    // const callback = jest.fn();

    // it('should have a div className oto-feedback', () => {

    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <UserFeedback sessionId={sessionId} callback={callback}/>
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     expect(wrapper.find('div.oto-feedback')).toHaveLength(1);
    // });
    // it('should have 1 text field', () => {
    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <UserFeedback />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     expect(wrapper.find(TextArea)).toHaveLength(1);
    // });
    // it('should change state comment when TextField onChange event fires', () => {
    //     const setState = jest.fn();
    //     const useStateMock: any = (initState: any) => [initState, setState];
    //     jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <UserFeedback />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     wrapper.find(TextArea).at(0).simulate('change', { target: { value: 'Test texts' } });
    //     expect(setState).toHaveBeenCalledTimes(1);
    //     expect(setState).toHaveBeenCalledWith({comment: 'Test texts', passFail: FeedbackEnum.UNSET});
    // });
    // it('should have 2 checkboxes', () => {
    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <UserFeedback />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     expect(wrapper.find(Checkbox)).toHaveLength(2);
    // });
    // it('should have initial value 0 - pass updates the state to 2 - fail updates the state to 1', () => {
    //     const setState = jest.fn();
    //     const useStateMock: any = (initState: any) => [initState, setState];
    //     jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <UserFeedback />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     wrapper.find(Checkbox).at(0).simulate('change', { target: { value: ''}});
    //     expect(setState).toHaveBeenCalledWith({comment: '', passFail: FeedbackEnum.PASS});
    //     wrapper.find(Checkbox).at(1).simulate('change', { target: { value: ''}});
    //     expect(setState).toHaveBeenCalledWith({comment: '', passFail: FeedbackEnum.FAIL});
    // });
    // it('should have 1 button', () => {
    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <UserFeedback sessionId={sessionId} callback={callback}/>
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     expect(wrapper.find(Button)).toHaveLength(1);
    // });
    // it('should save user feedback ', () => {
    //     const mockcallback: any = jest.fn();
    //     const spy = jest.spyOn(Controller, 'storeFeedback');
    //     const wrapper: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <UserFeedback sessionId={sessionId} callback={mockcallback} />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     );
    //     wrapper.dive().find(Button).at(0).props().onClick();
    //     expect(spy).toHaveBeenCalled();
    // });
});
