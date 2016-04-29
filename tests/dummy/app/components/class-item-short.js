import Ember from 'ember';

const {
  A,
  Component,
  computed,
  String: {capitalize}
} = Ember;

import layout from '../templates/components/class-item-short';

export default Component.extend({

  // ----- Arguments -----
  classItem:   null,
  classRecord: null,
  scrollable:  null,



  // ----- Overridden properties -----
  classNameBindings: [
    ':classItemShort',
    'accessClass',
    'itemTypeClass',
    'staticClass',
    'deprecatedClass',
    'inheritedClass'
  ],
  layout,


  // ----- Computed properties -----
  isInherited: computed(
    'classItem.class',
    'classRecord.',
    function () {
      return this.get('classItem.class') !== this.get('classRecord');
    }
  ),

  isOverridden: computed(
    'classItem.class.inheritedClassItems.@each.name',
    'classItem.name',
    function () {
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
      this.get('isOverridden') ? 'Overridden'   :
      this.get('isInherited')  ? 'Inherited'    :
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
      this.get('isOverridden') ? '_overridden'   :
      this.get('isInherited')  ? '_inherited'    :
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
