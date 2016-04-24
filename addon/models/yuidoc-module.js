import Model                from 'ember-data/model';
import attr                 from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default Model.extend({

  // ----- Attributes -----
  description: attr('string'),
  isMain:      attr('boolean'),
  itemType:    attr('string'),
  tag:         attr('string'),
  line:        attr('number'),



  // ----- Relationships -----
  version:      belongsTo('yuidoc-version', {async: false}),
  parentModule: belongsTo('yuidoc-module',  {async: false, inverse: 'submodules'}),
  file:         belongsTo('yuidoc-file',    {async: false}),

  classes:    hasMany('yuidoc-class',      {async: false}),
  classItems: hasMany('yuidoc-class-item', {async: false}),
  namespaces: hasMany('yuidoc-namespace',  {async: false}),
  submodules: hasMany('yuidoc-module',     {async: false, inverse: 'parentModule'}),
});





