import Ember from 'ember';

const {
  Component
} = Ember;

import layout from '../templates/components/me-nu';

export default Component.extend({
  
  // ----- Arguments -----
  versionRecord: null,
  
  
  // ----- Overridden properties -----
  layout,
  classNames: ['meNu'],
  
  
});
