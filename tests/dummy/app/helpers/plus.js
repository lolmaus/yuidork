import Ember from 'ember';

export function plus(params/*, hash*/) {
  return params.reduce((a, b) => a + b);
}

export default Ember.Helper.helper(plus);
