import testScripts from './data/testScripts.json';
import {ADD_SCRIPT, DELETE_SCRIPT} from "./constants/actionTypes";

var initialState = {
  scripts: testScripts
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SCRIPT:
      return {
        ...state,
        scripts: [...state.scripts, action.script]
      }
    case DELETE_SCRIPT:
      return {
        ...state,
        scripts: state.scripts.filter(it => it !== action.script)
      }
  }
  return state;
}
export default rootReducer;