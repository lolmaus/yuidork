import Ember from 'ember';

const {
  A,
  Helper
} = Ember;

export function a(params/*, hash*/) {
  return A(params);
}

export default Helper.helper(a);
