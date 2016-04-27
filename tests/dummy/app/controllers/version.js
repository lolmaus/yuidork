import Ember from 'ember';

const {
  Controller
} = Ember;

export default Controller.extend({

  // ----- Query params -----
  queryParams: ['path'],
  path:        '*root*'
});
