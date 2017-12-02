import Ember from 'ember';

const {
  Component,
  computed,
  String: {capitalize}
} = Ember;

// import {ElementQueryMixin} from 'ember-element-query';

export default Component.extend({

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


  // ----- Computed properties -----
  isInherited: computed(
    'classItem.class',
    'classRecord',
    function () {
      return this.get('classItem.class') !== this.get('classRecord');
    }
  ),

  // isOverridden: computed(
  //   'classItem.class.inheritedClassItems.@each.name',
  //   'classItem.name',
  //   'isInherited',
  //   function () {
  //     if (this.get('isInherited')) {
  //       return false;
  //     }
  //
  //     const name = this.get('classItem.name');
  //
  //     return this
  //       .get('classItem.class.inheritedClassItemNames')
  //       .contains(name);
  //   }
  // ),
  //
  // overriddenClass: computed(
  //   'isOverridden',
  //   'classItem.name',
  //   'classItem.class.extends',
  //   function () {
  //     // return false
  //     if (
  //       this.get('isInherited')
  //       || !this.get('isOverridden')
  //     ) {
  //       return null;
  //     }
  //
  //     const classItem = this.get('classItem');
  //
  //     return this.getParentRecursively(classItem);
  //   }
  // ),

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
  // getParentRecursively (classItem) {
  //   const name                = classItem.get('name');
  //   const inheritedClassItems = classItem.get('class.inheritedClassItems');
  //   const parentClassItem     = inheritedClassItems.findBy('name', name);
  //
  //   if (!parentClassItem) {
  //     return null;
  //   }
  //
  //   const parentClassItemParent = this.getParentRecursively(parentClassItem);
  //
  //   return parentClassItemParent || parentClassItem.get('class');
  // }
});
