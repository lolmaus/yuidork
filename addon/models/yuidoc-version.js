import Model     from 'ember-data/model';
import {hasMany} from 'ember-data/relationships';

export default Model.extend({


  // ----- Relationships -----
  classes:    hasMany('yuidoc-class',      {async: false}),
  classItems: hasMany('yuidoc-class-item', {async: false}),
  files:      hasMany('yuidoc-file',       {async: false}),
  modules:    hasMany('yuidoc-module',     {async: false}),
  namespaces: hasMany('yuidoc-namespace',  {async: false}),
});
