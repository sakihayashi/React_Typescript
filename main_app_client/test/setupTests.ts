import * as React from 'react';

// import enzyme from 'enzyme';
// import Adapter from 'enzyme-adapter-react-17';

HTMLCanvasElement.prototype.getContext = () => null;

import { testStores } from './testData';

// enzyme.configure({ adapter: new Adapter() });
jest.mock('mobx-react', () => {
  const originalMobx = jest.requireActual('mobx-react');
  return {
    ...originalMobx,
    inject: (...injectNames) => (component) => (props) => {
        const renderProps = { ...props };
        for (let i = 0; i < injectNames.length; i++) {
            const injectName = injectNames[i];
            renderProps[injectName] = testStores[injectName];
        }
        return React.createElement(component, renderProps);
    },
    // mockStores: testStores,
  };
});
