import Ember from 'ember';

const {
  computed: {sort}
} = Ember;

import Model     from 'ember-data/model';
import attr      from 'ember-data/attr';
import {hasMany} from 'ember-data/relationships';

export default Model.extend({

  // ----- Attributes -----
  owner:   attr('string'),
  repo:    attr('string'),
  version: attr('string'),


  // ----- Relationships -----
  classes:    hasMany('yuidoc-class',      {async: false}),
  classItems: hasMany('yuidoc-class-item', {async: false}),
  files:      hasMany('yuidoc-file',       {async: false}),
  modules:    hasMany('yuidoc-module',     {async: false}),
  namespaces: hasMany('yuidoc-namespace',  {async: false}),



  // ----- ComputedProperties -----
  sortOrder:        ['id'],
  classesSorted:    sort('classes',    'sortOrder'),
  classItemsSorted: sort('classItems', 'sortOrder'),
  filesSorted:      sort('files',      'sortOrder'),
  modulesSorted:    sort('modules',    'sortOrder'),
  namespacesSorted: sort('namespaces', 'sortOrder'),

});
