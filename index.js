/** @format */
import * as React from 'react';
import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';
import { View, Text, Button } from 'react-native';

import Home from './components/Home';
import Detail from './components/Detail';
import Filter from './components/Filter';

import { GlobalContextProvider } from './GlobalContext';


const App = () => {
    const [componentName, setComponentName] = React.useState('Home');

    const _renderComponent = () => {
        switch (componentName) {
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

    return (<GlobalContextProvider>
        <Button onPress={() => setComponentName('Home')} title="Home" />
        <Button onPress={() => setComponentName('Detail')} title="Detail" />
        {_renderComponent()}
    </GlobalContextProvider>);
}


AppRegistry.registerComponent(appName, () => App);
