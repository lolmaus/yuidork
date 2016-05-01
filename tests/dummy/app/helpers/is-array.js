import Ember from 'ember';

const {
  Helper,
  isArray: emberIsArray,
} = Ember;

export function isArray([item]/*, hash*/) {
  return emberIsArray(item);
}

export default Helper.helper(isArray);
