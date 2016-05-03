import Ember from 'ember';

const {
  A,
  computed,
  computed: {alias, mapBy},
} = Ember;

import Model                from 'ember-data/model';
import attr                 from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

import urlWithLine from 'yuidork/macros/url-with-line';

export default Model.extend({

  // ----- Attributes -----
  description: attr('string'),
  line:        attr('number'),

  access:      attr('string'),
  static:      attr('boolean', {defaultValue: false}),
  deprecated:  attr('boolean', {defaultValue: false}),
  foreign:     attr('boolean', {defaultValue: false}),
  mixin:       attr('boolean', {defaultValue: false}),




  // ----- Relationships -----
  version:      belongsTo('yuidoc-version',    {async: false}),
  file:         belongsTo('yuidoc-file',       {async: false}),
  module:       belongsTo('yuidoc-module',     {async: false}),
  namespace:    belongsTo('yuidoc-namespace',  {async: false}),
  extends:      belongsTo('yuidoc-class',      {async: false, inverse: 'extensionFor'}),

  extensionFor: hasMany  ('yuidoc-class',      {async: false, inverse: 'extends'}),
  uses:         hasMany  ('yuidoc-class',      {async: false, inverse: 'usedIn'}),
  usedIn:       hasMany  ('yuidoc-class',      {async: false, inverse: 'uses'}),
  classItems:   hasMany  ('yuidoc-class-item', {async: false}),



  // ----- Computed properties -----
  urlWithLine:        urlWithLine(),
  name:               alias('id'),
  extendedClassItems: alias('extends.effectiveClassItems'),

  mixedInClassItemsArrays: mapBy('uses', 'effectiveClassItems'),

  mixedInClassItems: computed('mixedInClassItemsArrays.[]', function () {
    return A(
      this
        .get('mixedInClassItemsArrays')
        .reduce((a, b) => a.concat(b), [])
    );
  }),

  inheritedClassItems: computed(
    'extendedClassItems.[]',
    'mixedInClassItems.[]',
    function () {
      const extendedClassItems = (this.get('extendedClassItems') && this.get('extendedClassItems').toArray()) || [];
      const mixedInClassItems = this.get('mixedInClassItems').toArray();

      return A(
        extendedClassItems
          .concat(mixedInClassItems));
    }
  ),



  effectiveClassItems: computed(
    'classItems.[]',
    'inheritedClassItems.[]',
    function () {
      const inheritedClassItems = this.get('inheritedClassItems');
      const classItems          = this.get('classItems').toArray();

      const nonOverriddenClassItems =
        inheritedClassItems
          .filter(ci => {
            return !classItems.findBy('name', ci.get('name'));
          });

      return A(classItems.concat(nonOverriddenClassItems));
    }
  )
});
