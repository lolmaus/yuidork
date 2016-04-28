import Ember from 'ember';

const {
  A,
  Component,
  computed,
  computed: {alias, filterBy, sort}
} = Ember;

import layout from '../templates/components/class-items';

export default Component.extend({

  // ----- Arguments -----
  classRecord: null,



  // ----- Overridden properties -----
  classNames: ['classItems'],
  layout,



  // ----- Overwritable properties -----
  filterName:     '',

  showMethods:        true,
  showProperties:     true,
  showEvents:         true,
  showOtherItemTypes: true,

  showPublic:    true,
  showProtected: true,
  showPrivate:   true,

  showStatic:   true,
  showInstance: true,

  showDeprecated:    true,
  showNonDeprecated: true,

  showInherited:    true,
  showNonInherited: true,



  // ----- Computed properties -----
  classItems: alias('classRecord.effectiveClassItems'),

  classItemsSortOrder: ['name'],
  classItemsSorted:    sort('classItems', 'classItemsSortOrder'),

  classItemsFiltered: computed(
    'classItemsSorted.@each.{name,itemType,access,static,deprecated}',
    'classItemsNonInherited.[]',
    'filterName',
    'showMethods',
    'showProperties',
    'showEvents',
    'showOtherItemTypes',
    'showPublic',
    'showProtected',
    'showPrivate',
    'showStatic',
    'showInstance',
    'showDeprecated',
    'showNonDeprecated',
    'showInherited',
    'showNonInherited',
    function () {
      const filterName         = this.get('filterName');
      const showMethods        = this.get('showMethods');
      const showProperties     = this.get('showProperties');
      const showEvents         = this.get('showEvents');
      const showOtherItemTypes = this.get('showOtherItemTypes');
      const showPublic         = this.get('showPublic');
      const showProtected      = this.get('showProtected');
      const showPrivate        = this.get('showPrivate');
      const showStatic         = this.get('showStatic');
      const showInstance       = this.get('showInstance');
      const showDeprecated     = this.get('showDeprecated');
      const showNonDeprecated  = this.get('showNonDeprecated');
      const showInherited      = this.get('showInherited');
      const showNonInherited   = this.get('showNonInherited');

      const itemTypes = ['method', 'property', 'event'];


      return this
        .get('classItemsSorted')
        .filter(classItem => (
          (
            !filterName
            || !filterName.length
            || classItem.get('name').indexOf(filterName) > -1
          )
          && (
            classItem.get('itemType') !== 'method'
            || showMethods && classItem.get('itemType') === 'method'
          )
          && (
            classItem.get('itemType') !== 'property'
            || showProperties && classItem.get('itemType') === 'property'
          )
          && (
            classItem.get('itemType') !== 'event'
            || showEvents && classItem.get('itemType') === 'event'
          )
          && (
            itemTypes.indexOf(classItem.get('itemType')) > -1
            || showOtherItemTypes && itemTypes.indexOf(classItem.get('itemType')) === -1
          )
          && (
            classItem.get('access') !== 'public'
            || showPublic && classItem.get('access') === 'public'
          )
          && (
            classItem.get('access') !== 'protected'
            || showProtected && classItem.get('access') === 'protected'
          )
          && (
            classItem.get('access') !== 'private'
            || showPrivate && classItem.get('access') === 'private'
          )
          && (
            classItem.get('static')
            || showInstance && !classItem.get('static')
          )
          && (
            !classItem.get('static')
            || showStatic && classItem.get('static')
          )
          && (
            classItem.get('deprecated')
            || showNonDeprecated && !classItem.get('deprecated')
          )
          && (
            !classItem.get('deprecated')
            || showDeprecated && classItem.get('deprecated')
          )
          && (
            !(
              this.get('classItemsNonInherited')
              && this.get('classItemsNonInherited').contains(classItem)
            )
            || (
              showNonInherited
              && this.get('classItemsNonInherited')
              && this.get('classItemsNonInherited').contains(classItem)
            )
          )
          && (
            !(
              this.get('classItemsInherited')
              && this.get('classItemsInherited').contains(classItem)
            )
            || (
              showInherited
              && this.get('classItemsInherited')
              && this.get('classItemsInherited').contains(classItem)
            )
          )
        ));
    }
  ),

  classItemsMethods:    filterBy('classItems', 'itemType', 'method'),
  classItemsProperties: filterBy('classItems', 'itemType', 'property'),
  classItemsEvents:     filterBy('classItems', 'itemType', 'event'),

  classItemsOtherTypes: computed('classItems.@each.itemType', function () {
    return this
      .get('classItems')
      .filter(classItem => ['method', 'property', 'event'].indexOf(classItem.get('itemType')) === -1);
  }),

  classItemsPublic:    filterBy('classItems', 'access', 'public'),
  classItemsProtected: filterBy('classItems', 'access', 'protected'),
  classItemsPrivate:   filterBy('classItems', 'access', 'private'),

  classItemsInstance: filterBy('classItems', 'static', false),
  classItemsStatic:   filterBy('classItems', 'static', true),

  classItemsDeprecated:    filterBy('classItems', 'deprecated', true),
  classItemsNonDeprecated: filterBy('classItems', 'deprecated', false),

  classItemsInherited: computed(
    'classRecord.effectiveClassItems.[]',
    'classRecord.classItems.[]',
    function () {
      const classItemsAll    = this.get('classRecord.effectiveClassItems');
      const classItemsNative = this.get('classRecord.classItems');

      return A(classItemsAll.filter(ci => !classItemsNative.contains(ci)));
    }
  ),
  classItemsNonInherited: alias('classRecord.classItems')
});
