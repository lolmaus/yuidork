import Ember from 'ember';

const {
  A,
  Component,
  computed,
  computed: {alias, filterBy, sort},
  Object: eObject
} = Ember;

const O = eObject.create.bind(eObject);

import ElementQueryMixin from 'ember-element-query/mixins/element-query';
import layout  from '../templates/components/class-items';

export default Component.extend(ElementQueryMixin, {

  // ----- Arguments -----
  classRecord:                 null,
  scrollableItemListHtmlClass: ".layoutDefault-content",



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

  staticMethodsAreCollapsed:      false,
  staticPropertiesAreCollapsed:   false,
  staticEventsAreCollapsed:       false,
  instanceMethodsAreCollapsed:    false,
  instancePropertiesAreCollapsed: false,
  instanceEventsAreCollapsed:     false,



  // ----- Computed properties -----
  classItems: alias('classRecord.effectiveClassItems'),

  classItemsSortOrder: ['name'],
  classItemsSorted:    sort('classItems', 'classItemsSortOrder'),

  classItemsFiltered: computed(
    'classItemsSorted.@each.{name,access,deprecated}',
    'classItemsNonInherited.[]',
    'filterName',
    'showPublic',
    'showProtected',
    'showPrivate',
    'showDeprecated',
    'showNonDeprecated',
    'showInherited',
    'showNonInherited',
    function () {
      const filterName         = this.get('filterName');
      const showPublic         = this.get('showPublic');
      const showProtected      = this.get('showProtected');
      const showPrivate        = this.get('showPrivate');
      const showDeprecated     = this.get('showDeprecated');
      const showNonDeprecated  = this.get('showNonDeprecated');
      const showInherited      = this.get('showInherited');
      const showNonInherited   = this.get('showNonInherited');

      return this
        .get('classItemsSorted')
        .filter(classItem => (
          (
            !filterName
            || !filterName.length
            || classItem.get('name').indexOf(filterName) > -1
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

  classItemsPublic:    filterBy('classItems', 'access', 'public'),
  classItemsProtected: filterBy('classItems', 'access', 'protected'),
  classItemsPrivate:   filterBy('classItems', 'access', 'private'),

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
  classItemsNonInherited: alias('classRecord.classItems'),

  hasMoreThanOneAccess: computed(
    'classItemsSorted.@each.access',
    function () {
      return A(
        this
          .get('classItemsSorted')
          .mapBy('access')
      )
        .uniq()
        .length > 1;
    }
  ),

  hasMoreThanOneDeprecation: computed(
    'classItemsSorted.@each.deprecated',
    function () {
      return A(
        this
          .get('classItemsSorted')
          .mapBy('deprecated')
      )
        .uniq()
        .length > 1;
    }
  ),

  hasMoreThanOneInheritance: computed(
    'classItemsInherited.[]',
    'classItemsNonInherited.[]',
    function () {
      return (
        !!this.get('classItemsInherited.length')
        && !!this.get('classItemsNonInherited.length')
      );
    }
  ),
});
