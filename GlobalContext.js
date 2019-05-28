import * as React from 'react';
import SQLiteProvider from './providers/SQLiteProvider';

const FETCH_HANDWORK = 'FETCH_HANDWORK';
const FETCH_UNUSAL = 'FETCH_UNUSAL';
const SET_CUR_ITEM =  'SET_CUR_ITEM';
const SET_CUR_VIEW = 'SET_CUR_VIEW';

var SQLiteObj = SQLiteProvider.getInstance();

let GlobalContext = React.createContext();

let initialState = {
    handworks: [],
    unusals: [],
    sections: [],
    currentItem: null,
    currentView: 'Home'
};

let reducer = (state, action) => {
    switch (action.type) {
        case SET_CUR_VIEW:
            return { ...state, currentView: action.payload }
        case FETCH_HANDWORK:
            let sections = action.payload.reduce((re, o) => {
                let existObj = re.find(obj => obj.title === o.route_id);  
                if (existObj) {
                    existObj.items.push(o);
                } else {
                    re.push({ title: o.route_id, items: [o] });
                }
                return re;
            }, []);   
            return { ...state, handworks: action.payload, sections: sections, currentItem: action.payload[0] };
        case FETCH_UNUSAL:
            return { ...state, unusals: action.payload };
        case SET_CUR_ITEM:
            return { ...state, currentItem: action.payload };
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
                    type: FETCH_HANDWORK,
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
                    type: FETCH_UNUSAL,
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
                    type: FETCH_HANDWORK,
                    payload: rows
                });
            });
        });
    };

    const setCurrentView = (view) => dispatch({ type: SET_CUR_VIEW, payload: view });
    const setCurrentIItem = (item) => dispatch({ type: SET_CUR_ITEM, payload: item });

    let actions = { fetchHandwork, fetchUnusal, applyFilter, setCurrentView, setCurrentIItem };
    let value = { state, actions };
    
    return (
        <GlobalContext.Provider value={value}>{props.children}</GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalContextProvider };