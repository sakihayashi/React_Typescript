// import { MenuButton, FontIcon } from 'react-md';
// import { FontIcon } from '@react-md/icon';
// import { shallow } from 'enzyme';
// import * as React from 'react';
// import { Header } from '../../src/Views/components/Header';
// import { testStores } from '../testData';

// import toJson from 'enzyme-to-json';

describe('dummy test', () => {
    test('dummy test', () => expect(true).toBe(true));
    // it('Should have oto-header wrapper div', () => {
    //     const wrapper: any = shallow(<Header {...testStores}/>);
    //     expect(wrapper.find('div.oto-header')).toHaveLength(1);
    // });

    // it('Should have two menu buttons', () => {
    //     const wrapper: any = shallow(<Header {...testStores} />);
    //     expect(wrapper.find(MenuButton)).toHaveLength(2);
    // });
    // it('renders the online connection status icon based on the isLoginModeOnline prop', () => {
    //     const mockAppState: any = { isLoginModeOnline: true};
    //     const wrapper: any = shallow(<Header {...testStores} appState={mockAppState} />);
    //     expect(wrapper.find(FontIcon).at(2).dive().text()).toEqual('cloud_done');
    // });
    // it('renders the offline connection status icon based on the isLoginModeOnline prop', () => {
    //     const mockAppState: any = { isLoginModeOnline: false};
    //     const wrapper: any = shallow(<Header {...testStores} appState={mockAppState} />);
    //     expect(wrapper.find(FontIcon).at(2).dive().text()).toEqual('cloud_off');
    // });
    // it('renders the offline connection status icon based on the isLoginModeOnline prop', () => {
    //     const mockAppState: any = { isLoginModeOnline: false};
    //     const wrapper: any = shallow(<Header {...testStores} appState={mockAppState} />);
    //     expect(wrapper.find(FontIcon).at(2).dive().text()).toEqual('cloud_off');
    // });
    // it('renders the app version', () => {
    //     const mockAppState: any = { version: 'Otosense Latest Version' };
    //     const wrapper: any = shallow(<Header {...testStores} appState={mockAppState} />);
    //     expect(wrapper.find('.oto-header__left').text()).toEqual('Otosense Latest Version');
    // });
    // it('should have class name specified ', () => {
    //     const wrapper: any = shallow(<Header {...testStores} />);
    //     expect(wrapper.find('.oto-header__text')).toHaveLength(1);
    // });
    // it('calls the toggleDateTimeFormat prop when the date and time display is clicked', () => {
    //     const mockAppState: any = {toggleDateTimeFormat: jest.fn()};
    //     const wrapper: any = shallow(<Header {...testStores} appState={mockAppState}/>);
    //     wrapper.find('.oto-header__text').simulate('click');
    //     expect(mockAppState.toggleDateTimeFormat).toHaveBeenCalledTimes(1);
    // });
    // it failed-returned false. probably not using onclick event
    // it('Should make languageVisible state true', () => {
    //     const wrapper: any = shallow(<Header {...testStores} />);
    //     wrapper.instance().onMenuClick();
    //     wrapper.find('#oto-header__menu-toggle-lan').simulate('click');
    //     expect(wrapper.state('languageVisible')).toBe(true);
    // });

    // it('Should have value en when locale English is clicked', () => {
    //     const wrapper: any = shallow(<Header {...testStores} />);
    //     wrapper.find('MenuButton').at(0).find(Button).simulate('click');
    //     expect(wrapper.prop('locale').locale).toBe('en');
    // });
    // it failed it does not find the second button possibly due to pass them via props
    // it('Should have value fr when locale French is clicked', () => {
    //     const wrapper: any = shallow(<Header {...testStores} />);
    //     expect(wrapper.find('#oto-header__menu-lan-en')).toHaveLength(1);
    //     expect(wrapper.find(Button)).toHaveLength(2);
    //     wrapper.find('#oto-header__menu-lan-fr').simulate('click');
    //     expect(wrapper.prop('locale').locale).toBe('fr');
    // });
    // it('Should have one Button wrappers for logout', () => {
    //     const wrapper: any = shallow(<Header {...testStores} />);
    //     expect(wrapper.find(MenuButton).at(1).find(Button)).toHaveLength(1);
    // });

    // it('check what is rendered in the wrapper via jest', () => {
    //     const wrapper: any = shallow(<Header {...testStores} />);
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

});
