import Ember from 'ember';

const {
  A,
  Component,
  computed
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

  hasMoreThanOne: null,

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

  groupBy:            null,



  // ----- Overridden properties -----
  classNames: ['classItemsFilter'],
  layout,


  // ----- Computed properties -----
  hasMoreThanOneOfAnything: computed('hasMoreThanOne', function () {
    const hasMoreThanOne = this.get('hasMoreThanOne');

    return A(
      Object
        .keys(hasMoreThanOne)
        .map(k => hasMoreThanOne[k])
    )
      .any(v => v);
  }),



  // ----- Actions -----
  actions: {
    clearFilterName () {
      this.set('filterName', '');
    },

    enableOnlyMethods () {
      this.setProperties({
        showMethods:        true,
        showProperties:     false,
        showEvents:         false,
        showOtherItemTypes: false,
      });
    },

    enableOnlyProperties () {
      this.setProperties({
        showMethods:        false,
        showProperties:     true,
        showEvents:         false,
        showOtherItemTypes: false,
      });
    },

    enableOnlyEvents () {
      this.setProperties({
        showMethods:        false,
        showProperties:     false,
        showEvents:         true,
        showOtherItemTypes: false,
      });
    },

    enableOnlyOtherItemTypes () {
      this.setProperties({
        showMethods:        false,
        showProperties:     false,
        showEvents:         false,
        showOtherItemTypes: true,
      });
    },

    enableOnlyPublic () {
      this.setProperties({
        showPublic:    true,
        showProtected: false,
        showPrivate:   false,
      });
    },

    enableOnlyProtected () {
      this.setProperties({
        showPublic:    false,
        showProtected: true,
        showPrivate:   false,
      });
    },

    enableOnlyPrivate () {
      this.setProperties({
        showPublic:    false,
        showProtected: false,
        showPrivate:   true,
      });
    },

    enableOnlyStatic () {
      this.setProperties({
        showStatic:   true,
        showInstance: false,
      });
    },

    enableOnlyInstance () {
      this.setProperties({
        showStatic:   false,
        showInstance: true,
      });
    },

    enableOnlyDeprecated () {
      this.setProperties({
        showDeprecated:    true,
        showNonDeprecated: false,
      });
    },

    enableOnlyNonDeprecated () {
      this.setProperties({
        showDeprecated:    false,
        showNonDeprecated: true,
      });
    },

    enableOnlyInherited () {
      this.setProperties({
        showInherited:    true,
        showNonInherited: false,
      });
    },

    enableOnlyNonInherited () {
      this.setProperties({
        showInherited:    false,
        showNonInherited: true,
      });
    },

    setGroupBy (value) {
      if (value === 'dont') {
        value = null;
      }

      this.set('groupBy', value);

      if (!value) {
        return;
      }

      if (value === 'itemType') {
        this.setProperties({
          showMethods:        true,
          showProperties:     true,
          showEvents:         true,
          showOtherItemTypes: true,
        });
        return;
      }

      if (value === 'access') {
        this.setProperties({
          showPublic:         true,
          showProtected:      true,
          showPrivate:        true,
        });
        return;
      }

      if (value === 'static') {
        this.setProperties({
          showStatic:         true,
          showInstance:       true,
        });
        return;
      }

      if (value === 'deprecated') {
        this.setProperties({
          showDeprecated:     true,
          showNonDeprecated:  true,
        });
        return;
      }

      if (value === 'inherited') {
        this.setProperties({
          showInherited:      true,
          showNonInherited:   true,
        });
        return;
      }
    }
  },
});
