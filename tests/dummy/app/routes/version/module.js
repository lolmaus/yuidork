/* jshint ignore:start */

import Ember from 'ember';

const {
  A,
  inject: {service},
  Route,
  RSVP
} = Ember;


export default Route.extend({

  // ----- Services -----
  ajaxYuidoc: service('ajax-yuidoc'),



  // ----- Overridden methods -----
  model ({moduleId}) {
    const parentModel   = this.modelFor('version');
    const currentModule = A(parentModel.modules).findBy('id', moduleId);
    
    return RSVP.hash({
      ...parentModel,
      currentModule
    })
  }
});
