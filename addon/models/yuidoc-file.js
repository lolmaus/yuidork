import Model                from 'ember-data/model';
import attr                 from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default Model.extend({

  // ----- Attributes -----
  content:      attr('string'),
  sha:          attr('string'),
  size:         attr('number'),
  gitHubApiUrl: attr('string'),


  // ----- Relationships -----
  version:    belongsTo('yuidoc-version', {async: false}),
  
  classes:    hasMany('yuidoc-class',     {async: false}),
  modules:    hasMany('yuidoc-module',    {async: false}),
  namespaces: hasMany('yuidoc-namespace', {async: false}),

});
