import Ember from 'ember';

const {
  computed,
} = Ember;

import Model       from 'ember-data/model';
import attr        from 'ember-data/attr';
import {belongsTo} from 'ember-data/relationships';

export default Model.extend({

  // ----- Attributes -----
  content:  attr('string'),
  title:    attr('string'),
  group:    attr('string'),
  position: attr('number'),



  // ----- Relationships -----
  version: belongsTo('yuidoc-version', {async: false}),



  // ----- Computed properties -----
  name: computed('title', 'id', function () {
    return this.get('title') || this.get('id');
  })
});
