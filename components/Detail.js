import * as React from 'react';
import { GlobalContext } from '../GlobalContext';
import { View, Text, Button } from 'react-native';

const Detail = () => {
    const { state } = React.useContext(GlobalContext);
    return <View><Text>Detail {state.count}</Text></View>;
};

export default Detail;