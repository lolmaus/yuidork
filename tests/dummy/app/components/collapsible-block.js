import Ember from 'ember';

const {
  Component
} = Ember;

import layout from '../templates/components/collapsible-block';

export default Component.extend({
  
  // ----- Arguments -----
  title:       null,
  isCollapsed: false,
  
  
  
  // ----- Overridden properties -----
  classNameBindings: [
    ':collapsibleBlock',
    'isCollapsed:-isCollapsed'
  ],
  layout,
  
  
  
  // ----- Actions -----
  actions: {
    toggleCollapse () {
      this.toggleProperty('isCollapsed');
    }
  }  
});
