import Model       from 'ember-data/model';
import attr        from 'ember-data/attr';
import {belongsTo} from 'ember-data/relationships';

export default Model.extend({

  // ----- Attributes -----
  name:        attr('string'),
  description: attr('string'),
  itemType:    attr('string'),
  line:        attr('number'),
  params:      attr(),



  // ----- Relationships -----
  version:   belongsTo('yuidoc-version',   {async: false}),
  file:      belongsTo('yuidoc-file',      {async: false}),
  module:    belongsTo('yuidoc-module',    {async: false}),
  class:     belongsTo('yuidoc-class',     {async: false}),
  namespace: belongsTo('yuidoc-namespace', {async: false}),

});
