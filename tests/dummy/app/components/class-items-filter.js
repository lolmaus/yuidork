import Ember from 'ember';

const {
  Component
} = Ember;

import layout from '../templates/components/class-items';

export default Component.extend({

  // ----- Arguments -----
  filterName:     '',
  
  showMethods:        true,
  showProperties:     true,
  showEvents:         true,
  showOtherItemTypes: true,
  showPublic:         true,
  showProtected:      true,
  showPrivate:        true,
  showStatic:         true,
  showInstance:       true,
  showDeprecated:     true,
  showNonDeprecated:  true,
  showInherited:      true,
  showNonInherited:   true,
  
  hasMethods:         null,
  hasProperties:      null,
  hasEvents:          null,
  hasOtherItemTypes:  null,
  hasPublic:          null,
  hasProtected:       null,
  hasPrivate:         null,
  hasInstance:        null,
  hasStatic:          null,
  hasDeprecated:      null,
  hasNonDeprecated:   null,
  hasInherited:       null,
  hasNonInherited:    null,



  // ----- Overridden properties -----
  classNames: ['classItemsFilter'],
  layout,



  // ----- Actions -----
  actions: {
    clearFilterName () {
      this.set('filterName', '');
    }
  }
});
