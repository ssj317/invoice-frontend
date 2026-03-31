import { combineReducers } from '@reduxjs/toolkit';
import invoiceReducer from './invoiceSlice';
import authReducer from './authSlice';

const rootReducer = combineReducers({
	invoice: invoiceReducer,
	auth: authReducer,
});

export default rootReducer;
