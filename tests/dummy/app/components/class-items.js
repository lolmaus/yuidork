import Ember from 'ember';

const {
  A,
  Component,
  computed,
  computed: {alias, filterBy, sort},
  Object: eObject
} = Ember;

const O = eObject.create.bind(eObject);

import eqMixin from '../mixins/e-q';
import layout  from '../templates/components/class-items';

export default Component.extend(eqMixin, {

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

  groupBy: 'itemType',



  // ----- Static properties -----
  groupBySortOrder: [
    'method',
    'property',
    'event',

    'public',
    'protected',
    'private',

    'instance',
    'static',

    'non-deprecated',
    'deprecated',

    'non-inherited',
    'inherited',

    'other'
  ],

  namedGroupBys: A(['itemType', 'access']),

  boolGroupBys: {
    static: {
      true:  'static',
      false: 'instance'
    }
  },



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

  classItemsEffective: computed(
    'classItemsFiltered.@each.{name,itemType,access,static,deprecated}',
    'groupBy',
    function () {
      const groupBy    = this.get('groupBy');
      const classItems = this.get('classItemsFiltered');

      if (!groupBy) {
        return classItems;
      }

      return classItems
        .reduce((result, item) => {
          const value =
            groupBy === 'inherited'
            ? !this.get('classRecord.classItems').contains(item)
            : item.get(groupBy);

          const groupName = this.getGroupName(groupBy, value);
          const group     = result.get(groupName) || result.set(groupName, A());

          group.addObject(item);

          return result;
        }, O());
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
  classItemsNonInherited: alias('classRecord.classItems'),

  hasMoreThanOneItemType: computed(
    'classItemsSorted.@each.itemType',
    function () {
      return A(
        this
          .get('classItemsSorted')
          .mapBy('itemType')
      )
        .uniq()
        .length > 1;
    }
  ),

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

  hasMoreThanOneStasis: computed(
    'classItemsSorted.@each.static',
    function () {
      return A(
        this
          .get('classItemsSorted')
          .mapBy('static')
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



  // ----- Methods -----
  getGroupName (groupBy, value) {
    const namedGroupBys = this.get('namedGroupBys');

    if (namedGroupBys.contains(groupBy)) {
      return value || 'other';
    }

    const boolGroupBys = this.get('boolGroupBys');

    if (boolGroupBys[groupBy]) {
      return boolGroupBys[groupBy][!!value];
    }

    const prefix = value ? '' : 'non-';

    return prefix + groupBy;
  }
});
