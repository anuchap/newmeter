import * as React from 'react';
import SQLiteProvider from './providers/SQLiteProvider';

var SQLiteObj = SQLiteProvider.getInstance();

let GlobalContext = React.createContext();

let initialState = {
    count: 10,
    currentComponent: 'Home',
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
        case 'set-current-component':
            return { ...state, currentComponent: action.payload }
        case 'fetch-handwork':
            let sections = action.payload.reduce((re, o) => {
                let existObj = re.find(obj => obj.title === o.route_id);  
                if (existObj) {
                    existObj.items.push(o);
                } else {
                    re.push({ title: o.route_id, items: [o] });
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
                });
            });
        });
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
                });
            });
        });
    };

    const applyFilter = ({ route_id, read_order, meter_id, account_no, old_account, order_by }) => {

        let q = `select * from handwork 
                where meter_id like '%${meter_id.trim()}%' 
                and account_no like '%${account_no.trim()}%' 
                and old_account like '%${old_account.trim()}%'`;
            q += route_id ? ` and route_id = '${route_id.trim()}'` : '';
            q += read_order ? ` and read_order = '${read_order.trim()}'` : '';
            q += ` order by ${order_by.trim()}`;

        SQLiteObj.transaction((tx) => {
            tx.executeSql(q, [], (tx, results) => {
                var len = results.rows.length;
                var rows = [];
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    rows.push(row);
                }
                dispatch({
                    type: 'fetch-handwork',
                    payload: rows
                });
            });
        });
    };

    let actions = { fetchHandwork, fetchUnusal };
    let value = { state, dispatch, actions };
    
    return (
        <GlobalContext.Provider value={value}>{props.children}</GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalContextProvider };