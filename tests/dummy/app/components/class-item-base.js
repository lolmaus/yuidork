import Ember from 'ember';

const {
  A,
  Component,
  computed,
  String: {capitalize}
} = Ember;

import eqMixin from '../mixins/e-q';

export default Component.extend(eqMixin, {

  // ----- Arguments -----
  classItem:   null,
  classRecord: null,
  scrollable:  null,



  // ----- Overridden properties -----
  classNameBindings: [
    'accessClass',
    'itemTypeClass',
    'staticClass',
    'deprecatedClass',
    'inheritedClass'
  ],

  eqSlices: {
       0:  'xxs',
     200:   'xs',
     250:   'ys',
     400:    's',
     600:    'm',
     800:    'l',
    1000:   'xl',
    1200:  'xxl',
    1400: 'xxxl',
  },


  // ----- Computed properties -----
  isInherited: computed(
    'classItem.class',
    'classRecord',
    function () {
      return this.get('classItem.class') !== this.get('classRecord');
    }
  ),

  isOverridden: computed(
    'classItem.class.inheritedClassItems.@each.name',
    'classItem.name',
    'isInherited',
    function () {
      if (this.get('isInherited')) {
        return false;
      }

      const name = this.get('classItem.name');

      return A(
        this
          .get('classItem.class.inheritedClassItems')
          .mapBy('name')
      )
        .contains(name);
    }
  ),

  overriddenClass: computed(
    'isOverridden',
    'classItem.name',
    'classItem.class.extends',
    function () {
      if (!this.get('isOverridden')) {
        return null;
      }

      const name   = this.get('classItem.name');
      const parent = this.get('classItem.class.extends');

      return this.getParentRecursively(name, parent);
    }
  ),

  itemTypeIconName: computed('classItem.itemType', function () {
    const itemType = this.get('classItem.itemType');

    return (
      itemType === 'method'   ? 'document--arrow'  :
      itemType === 'property' ? 'document--pencil' :
      itemType === 'event'    ? 'document-clock'  :
                                'document'
    );
  }),

  accessIconName: computed('classItem.access', function () {
    const access = this.get('classItem.access');

    return (
      access === 'public'    ? 'lock-unlock'  :
      access === 'protected' ? 'lock--plus' :
      access === 'private'   ? 'lock--minus'  :
                               'exclamation'
    );
  }),

  inheritedIconName: computed('isOverridden', function () {
    return this
      .get('isOverridden')
      ? 'chain--pencil'
      : 'chain';
  }),

  accessIconTitle: computed('classItem.access', function () {
    const access = this.get('classItem.access');
    return access ? capitalize(access) : 'wtf @access';
  }),

  staticIconTitle: computed('classItem.static', function () {
    const isStatic = this.get('classItem.static');
    return isStatic ? 'Static' : 'Instance';
  }),

  deprecatedIconTitle: computed('classItem.access', function () {
    const deprecated = this.get('classItem.deprecated');
    return deprecated ? "Deprecated" : "Non-deprecated";
  }),

  inheritedIconTitle: computed('isInherited', 'isOverridden', function () {
    return (
      this.get('isInherited')  ? 'Inherited'    :
      this.get('isOverridden') ? 'Overridden'   :
                                 'Non-inherited'
    );
  }),

  accessClass: computed('classItem.access', function () {
    const access = this.get('classItem.access');
    return `_${access}`;
  }),

  itemTypeClass: computed('classItem.access', function () {
    const itemType = this.get('classItem.itemType');
    return `_${itemType}`;
  }),

  staticClass: computed('classItem.static', function () {
    const isStatic = this.get('classItem.static');
    return isStatic ? "_static" : "_instance";
  }),

  deprecatedClass: computed('classItem.access', function () {
    const deprecated = this.get('classItem.deprecated');
    return deprecated ? "_deprecated" : "_nonDeprecated";
  }),

  inheritedClass: computed('isInherited', 'isOverridden', function () {
    return (
      this.get('isInherited')  ? '_inherited'    :
      this.get('isOverridden') ? '_overridden'   :
                                 '_nonInherited'
    );
  }),



  // ----- Custom methods -----
  getParentRecursively (classItemName, parent) {
    const classItemNames =
      A(
        parent
          .get('classItems')
          .mapBy('name')
      );

    if (classItemNames.contains(classItemName)) {
      return parent;
    }

    const nextParent = parent.get('extends');

    if (nextParent) {
      return this.getParentRecursively(classItemName, parent);
    }

    return false;
  }
});
