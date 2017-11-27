/* jshint ignore:start */

import Ember from 'ember';

const {
  A,
  inject: {service},
  Route,
  RSVP
} = Ember;

import {deserialize} from 'yuidork/utils/de-serialize';


export default Route.extend({

  // ----- Services -----
  ajaxYuidoc: service('ajax-yuidoc'),



  // ----- Overridden methods -----
  model ({classId}) {
    const parentModel   = this.modelFor('version');
    
    classId = deserialize(classId);

    const currentClass =
      parentModel
        .versionRecord
        .get('classes')
        .findBy('id', classId);

    return RSVP.hash({
      ...parentModel,
      currentClass
    })
  }
});
