import Ember from 'ember';

const {
  A,
  computed,
  computed: {alias, mapBy},
} = Ember;

import Model                from 'ember-data/model';
import attr                 from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default Model.extend({

  // ----- Attributes -----
  description: attr('string'),
  line:        attr('number'),

  access:      attr('string'),
  static:      attr('boolean'),
  deprecated:  attr('boolean'),




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
  name:                alias('id'),
  inheritedClassItems: alias('extends.effectiveClassItems'),

  mixedInClassItemsArrays: mapBy('uses', 'effectiveClassItems'),

  mixedInClassItems: computed('mixedInClassItemsArrays.[]', function () {
    return A(
      this
        .get('mixedInClassItemsArrays')
        .reduce((a, b) => a.concat(b), [])
    );
  }),

  effectiveClassItems: computed(
    'classItems.[]',
    'inheritedClassItems.[]',
    'mixedInClassItems.[]',
    function () {
      const classItems          = this.get('classItems').toArray();
      const inheritedClassItems = (this.get('inheritedClassItems') && this.get('inheritedClassItems').toArray()) || [];
      const mixedInClassItems   = this.get('mixedInClassItems').toArray();

      return A([].concat(classItems).concat(inheritedClassItems).concat(mixedInClassItems));
    }
  )
});
