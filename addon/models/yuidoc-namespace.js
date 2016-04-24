import Model                from 'ember-data/model';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default Model.extend({

  // ----- Attributes -----



  // ----- Relationships -----
  version: belongsTo('yuidoc-version', {async: false}),
  module:  belongsTo('yuidoc-module',  {async: false}),
  
  classes:    hasMany('yuidoc-class',      {async: false}),
  classItems: hasMany('yuidoc-class-item', {async: false}),
  
});
