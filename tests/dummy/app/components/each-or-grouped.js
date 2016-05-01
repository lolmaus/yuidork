import Ember from 'ember';

const {
  Component
} = Ember;

import layout from '../templates/components/each-or-grouped';

export default Component.extend({
  
  // ----- Arguments -----
  items: null, // array or hash
  
  
  
  // ----- Overridden properties -----
  layout,
  classNames: ['eachOrGrouped']
});
