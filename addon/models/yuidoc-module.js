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
  
  isMain:      attr('boolean'),
  itemType:    attr('string'),
  tag:         attr('string'),
  deprecated:  attr('boolean'),



  // ----- Relationships -----
  version:      belongsTo('yuidoc-version', {async: false}),
  parentModule: belongsTo('yuidoc-module',  {async: false, inverse: 'submodules'}),
  file:         belongsTo('yuidoc-file',    {async: false}),

  classes:    hasMany('yuidoc-class',      {async: false}),
  classItems: hasMany('yuidoc-class-item', {async: false}),
  namespaces: hasMany('yuidoc-namespace',  {async: false}),
  submodules: hasMany('yuidoc-module',     {async: false, inverse: 'parentModule'}),



  // ----- Computed properties -----
  name: alias('id')
});





