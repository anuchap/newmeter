import * as React from 'react';
import SQLiteProvider from './providers/SQLiteProvider';

var SQLiteObj = SQLiteProvider.getInstance();

let GlobalContext = React.createContext();

let initialState = {
    count: 10,
    handworks: [],
    unusals: [],
    hwSections: [],
    currentHw: null
};

let reducer = (state, action) => {
    switch (action.type) {
        case 'reset':
            return initialState;
        case 'increment':
            return { ...state, count: state.count + 1 };
        case 'decrement':
            return { ...state, count: state.count - 1 };
        case 'fetch-handwork':
            let sections = action.payload.reduce((re, o) => {
                let existObj = re.find(obj => obj.title === o.route_id);  
                if (existObj) {
                    existObj.data.push(o);
                } else {
                    re.push({ title: o.route_id, data: [o] });
                }
                return re;
            }, []);   
            return { ...state, handworks: action.payload, handworkSections: sections, currentHw: action.payload[0] };
        case 'fetch-unusal':
            return { ...state, unusals: action.payload };
        case 'set-current-hw':
            return { ...state, currentHw: action.payload };
        default:
            return state;
    }
};

function GlobalContextProvider(props) {
    let [state, dispatch] = React.useReducer(reducer, initialState);

    const fetchHandwork = () => {
        SQLiteObj.transaction((tx) => {
            tx.executeSql('select * from handwork order by seq_no', [], (tx, results) => {
                var len = results.rows.length;
                var rows = [];
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    row.index = i;
                    rows.push(row);
                }

                dispatch({
                    type: 'fetch-handwork',
                    payload: rows
                })
            })
        })
    };

    const fetchUnusal = () => {
        SQLiteObj.transaction((tx) => {
            tx.executeSql('select * from unusal', [], (tx, results) => {
                var len = results.rows.length;
                var rows = [];
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    rows.push(row);
                }

                dispatch({
                    type: 'fetch-unusal',
                    payload: rows
                })
            })
        })
    };

    let actions = { fetchHandwork, fetchUnusal };
    let value = { state, dispatch, actions };

    return (
        <GlobalContext.Provider value={value}>{props.children}</GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalContextProvider };