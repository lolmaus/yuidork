import Model       from 'ember-data/model';
import attr        from 'ember-data/attr';
import {belongsTo} from 'ember-data/relationships';

import urlWithLine from 'yuidork/macros/url-with-line';

export default Model.extend({

  // ----- Attributes -----
  name:        attr('string'),
  description: attr('string'),
  line:        attr('number'),

  itemType:    attr('string'),
  access:      attr('string'),
  static:      attr('boolean'),
  deprecated:  attr('boolean'),
  final:       attr('boolean'),
  computed:    attr('boolean'),
  ovserver:    attr('boolean'),
  on:          attr('boolean'),
  optional:    attr('boolean'),

  params:      attr(),
  return:      attr(),
  type:        attr('string'),
  default:     attr('string'),
  example:     attr('string'),



  // ----- Relationships -----
  version:   belongsTo('yuidoc-version',   {async: false}),
  file:      belongsTo('yuidoc-file',      {async: false}),
  module:    belongsTo('yuidoc-module',    {async: false}),
  class:     belongsTo('yuidoc-class',     {async: false}),
  namespace: belongsTo('yuidoc-namespace', {async: false}),



  // ----- Computed properties -----
  urlWithLine: urlWithLine()

});
