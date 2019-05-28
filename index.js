/** @format */
import * as React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import Home from './components/Home';
import Detail from './components/Detail';
import Filter from './components/Filter';

import { GlobalContextProvider, GlobalContext } from './GlobalContext';


const Main = () => {
    const { state } = React.useContext(GlobalContext);
    const _renderComponent = () => {
        switch (state.currentComponent) {
            case 'Home':
                return <Home />;
            case 'Detail':
                return <Detail />;
            case 'Filter':
                return <Filter />;
            default:
                return <Main />;
        }
    }
    return _renderComponent();
};

const App = () => {
    return (<GlobalContextProvider>
        <Main />
    </GlobalContextProvider>);
}


AppRegistry.registerComponent(appName, () => App);
