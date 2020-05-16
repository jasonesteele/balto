import {ADD_SCRIPT, DELETE_SCRIPT} from "../constants/actionTypes";

export function addScript(script) {
  return { type: ADD_SCRIPT, script }
}

export function deleteScript(script, index) {
  return { type: DELETE_SCRIPT, script, index }
}