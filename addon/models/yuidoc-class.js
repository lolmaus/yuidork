import Ember from 'ember';

const {
  computed: {alias}
} = Ember;

import Model                from 'ember-data/model';
import attr                 from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default Model.extend({

  // ----- Attributes -----
  description: attr('string'),
  line:        attr('number'),



  // ----- Relationships -----
  version:      belongsTo('yuidoc-version',    {async: false}),
  file:         belongsTo('yuidoc-file',       {async: false}),
  module:       belongsTo('yuidoc-module',     {async: false}),
  namespace:    belongsTo('yuidoc-namespace',  {async: false}),
  extends:      belongsTo('yuidoc-class',      {async: false, inverse: 'extensionFor'}),

  extensionFor: hasMany  ('yuidoc-class',      {async: false, inverse: 'extends'}),
  classItems:   hasMany  ('yuidoc-class-item', {async: false}),



  // ----- Computed properties -----
  name: alias('id')
});
