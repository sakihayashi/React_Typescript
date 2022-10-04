// import { AutoComplete } from '@react-md/autocomplete';
// import { Button } from '@react-md/button';
// import { shallow } from 'enzyme';
// import React from 'react';
// import * as RootContextModule from '../../../src/App';
// import { IdentifierInput } from '../../../src/Views/DataCollectionAndAnalysis/screens/IdentifierInput';
// import toJson from 'enzyme-to-json';
// import { testRootStore } from '../../testData';

describe('', () => {
    test('dummy test', () => expect(true).toBe(true));
    // jest.spyOn(RootContextModule, 'useRootContext').mockImplementation(() => (testRootStore));
    // const wrapper: any = shallow(
    //     <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //         <IdentifierInput />
    //     </RootContextModule.RootStoreContext.Provider>,
    // ).dive();
    // I can make mock api
    // jest.mock('../../../Views/api', ()=>{
    //     return{
    //         default: async () =>[
    //         ]
    //     }
    // })

    // TODO test this component
    // it('should have className oto-dropdown__group in a div element', () => {
    //     expect(wrapper.find('div.oto-dropdown__container')).toHaveLength(1);
    // });
    // it('should have 3 Autocomplete components', () => {
    //     expect(wrapper.find(AutoComplete)).toHaveLength(3);
    // });
    // it('should have a button', () => {
    //     const component: any = wrapper.find(Button);
    //     expect(component).toHaveLength(1);
    // });
    // it('should have three Autocomplete', () => {
    //     expect(wrapper.find(AutoComplete)).toHaveLength(3);
    // });
    // it('should update assetTypeInput state to the specified', () => {
    //     const setState = jest.fn();
    //     const useStateMock: any = (initState: any) => [initState, setState];
    //     jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    //     const wrapper1: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <IdentifierInput />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     wrapper1.find(AutoComplete).at(0).simulate('change', { target: { defaultValue: 'QC_DEFAULT'}});
    //     expect(setState).toHaveBeenCalledWith('QC_DEFAULT');
    // });
    // it('should update assetVariantInput state to the specified', () => {
    //     const setState = jest.fn();
    //     const useStateMock: any = (initState: any) => [initState, setState];
    //     jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    //     const wrapper2: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <IdentifierInput />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     wrapper2.find(AutoComplete).at(1).simulate('change', { target: { defaultValue: 'QC_DEFAULT'}});
    //     expect(setState).toHaveBeenCalledWith('QC_DEFAULT');
    // });
    // it('should update assetChannelInput state to the specified', () => {
    //     const setState = jest.fn();
    //     const useStateMock: any = (initState: any) => [initState, setState];
    //     jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    //     const wrapper3: any = shallow(
    //         <RootContextModule.RootStoreContext.Provider value={testRootStore}>
    //             <IdentifierInput />
    //         </RootContextModule.RootStoreContext.Provider>,
    //     ).dive();
    //     wrapper3.find(AutoComplete).at(2).simulate('change', { target: { defaultValue: 'QC_DEFAULT'}});
    //     expect(setState).toHaveBeenCalledWith('QC_DEFAULT');
    // });
});
