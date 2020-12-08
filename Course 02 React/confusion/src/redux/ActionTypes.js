//this file holds the different action types the reducer functions take in

//this action is for adding comments in the submit comments
export const ADD_COMMENT = 'ADD_COMMENT';

//fetching dishes. for example from a server
export const DISHES_LOADING = "DISHES_LOADING";
//failed to fetch the dishes
export const DISHES_FAILED = "DISHES_FAILED";
//add dishes into our store
export const ADD_DISHES = "ADD_DISHES";     

//json server section
//action types to fetch comments
export const ADD_COMMENTS = 'ADD_COMMENTS';
export const COMMENTS_FAILED = 'COMMENTS_FAILED';       
//by the time home component is loaded comments will already be loaded, so there's no comments_loaded

//types to fetch promotions
export const PROMOS_LOADING = 'PROMOS_LOADING';
export const ADD_PROMOS = 'ADD_PROMOS';
export const PROMOS_FAILED = 'PROMOS_FAILED';

//types to fetch leaders
export const LEADERS_LOADING = 'LEADERS_LOADING';
export const ADD_LEADERS = 'ADD_LEADERS';
export const LEADERS_FAILED = 'LEADERS_FAILED';
