import { createStore } from "redux"; /* applyMiddleware*/
import rootReducer from "../reducers";

const store = createStore(rootReducer, {});

export default store;
