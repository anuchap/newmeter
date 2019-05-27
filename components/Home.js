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
                    Section {section}
                </Text>
            </View>
        );
    };

    const _renderIndexPath = ({ section: section, row: row }) => {
        return (
            <View style={styles.row}>
                <Text>
                    Section {section} Row {row}
                </Text>
                <View style={styles.line} />
            </View>
        );
    };

    const _sectionCount = 10;
    const _rowCount = 10;


    const data = [];
    for (let section = 0; section < _sectionCount; ++section) {
        const sContent = { items: [] };
        for (let row = 0; row < _rowCount; ++row) {
            sContent.items.push(row);
        }
        data.push(sContent);
    }


    return (<View>
        <Text>{state.count}</Text>

        <Button onPress={() => dispatch({ type: 'increment' })} title="+" />
        <Button onPress={() => dispatch({ type: 'decrement' })} title="-" />

        <Button onPress={actions.fetchHandwork} title="handwork" />
        <Button onPress={actions.fetchUnusal} title="unusal" />
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