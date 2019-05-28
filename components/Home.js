import * as React from 'react';
import { GlobalContext } from '../GlobalContext';
import { View, Text, Button, StyleSheet } from 'react-native';
import { LargeList } from "react-native-largelist-v3";

const Home = () => {
    const { state, dispatch, actions } = React.useContext(GlobalContext);

    React.useEffect(() => {
        actions.fetchUnusal();
        actions.fetchHandwork();


    }, []);

    const _renderSection = (section) => {
        return (
            <View style={styles.section}>
                <Text>
                    Section {state.hwSections[section].route_id}
                </Text>
            </View>
        );
    };

    const _renderIndexPath = ({ section, row }) => {
        const item = state.hwSections[section].items[row];
        return (
            <View>
                <Button onPress={() => 
                    dispatch({ type: 'set-current-component', payload: 'Filter' })
                } title="Filter" />
                <TouchableOpacity
                    onPress={() => {
                        dispatch({ type: 'set-current-hw', payload: item });
                        dispatch({ type: 'set-current-component', payload: 'Detail' });
                    }}>
                    <View style={styles.row}>
                        <Text>
                            {JSON.stringify(state.hwSections[section].items[row])}
                        </Text>
                        <View style={styles.line} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const data = [];
    for (let section = 0; section < state.hwSections.length; ++section) {
        const sContent = { items: [] };
        for (let row = 0; row < state.hwSections[section].items.length; ++row) {
            sContent.items.push(row);
        }
        data.push(sContent);
    }

    return (<View>
        <LargeList
            style={styles.container}
            data={data}
            heightForSection={() => 50}
            renderSection={_renderSection}
            heightForIndexPath={() => 50}
            renderIndexPath={_renderIndexPath} />
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    section: {
        flex: 1,
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center"
    },
    row: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    line: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 1,
        backgroundColor: "#EEE"
    }
});

export default Home;