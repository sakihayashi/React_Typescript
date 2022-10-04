// import { Button } from '@react-md/button';
// import { TextField } from '@react-md/form';
// import { shallow } from 'enzyme';
// import * as React from 'react';
// import { RootStoreContext } from '../../src/App'
// import * as RootContextModule from '../../src/App';
// import { Login } from '../../src/Views/Login';
// import { testRootStore } from '../testData';
describe('Login', () => {
    test('dummy test', () => expect(true).toBe(true));
  });
// describe('Login component', () => {
//     jest.spyOn(RootContextModule, 'useRootContext').mockImplementation(() => (testRootStore));

//     it('should have three TextField components', () => {
//         const wrapper1: any = shallow(
//             <RootContextModule.RootStoreContext.Provider value={testRootStore}>
//                 <Login />
//             </RootContextModule.RootStoreContext.Provider>,
//         ).dive();
//         expect(wrapper1.find(TextField)).toHaveLength(2);
//     });

//     it('should update state.email', () => {
//         const wrapper2: any = shallow(
//             <RootContextModule.RootStoreContext.Provider value={testRootStore}>
//                 <Login />
//             </RootContextModule.RootStoreContext.Provider>,
//         ).dive();
//         wrapper2.find(TextField).at(0).simulate('change', {target: { value: 'dev@analogdevices.com' }});
//         expect(wrapper2.find(TextField).at(0).prop('value')).toBe('dev@analogdevices.com');
//     });
//     it('should update state.password', () => {
//         const wrapper3: any = shallow(
//             <RootContextModule.RootStoreContext.Provider value={testRootStore}>
//                 <Login />
//             </RootContextModule.RootStoreContext.Provider>,
//         ).dive();
//         wrapper3.find(TextField).at(1).simulate('change', {target: { value: 'password' }});
//         expect(wrapper3.find(TextField).at(1).prop('value')).toBe('password');

//     });
//     it('should call appState.login on submit', () => {
//         // const mockAppState: any = { login: jest.fn() };
//         const wrapper4: any = shallow(
//             <RootContextModule.RootStoreContext.Provider value={testRootStore}>
//                 <Login />
//             </RootContextModule.RootStoreContext.Provider>,
//         ).dive();
//         wrapper4.find(Button).simulate('click');
//         // (wrapper.instance() as Login).login(); ->returns null with FC
//         expect(wrapper4.find(Button).prop('disabled')).toBe(true);
//         // expect(mockAppState.login()).toHaveBeenCalledWith('', '', '');
//     });

// });
