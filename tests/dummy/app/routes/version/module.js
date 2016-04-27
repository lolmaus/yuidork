/* jshint ignore:start */

import Ember from 'ember';

const {
  Route,
  RSVP
} = Ember;


export default Route.extend({

  // ----- Overridden methods -----
  model ({moduleId}) {
    const parentModel   = this.modelFor('version');
    
    const currentModule =
      parentModel
        .versionRecord
        .get('modules')
        .findBy('id', moduleId);
    
    return RSVP.hash({
      ...parentModel,
      currentModule
    })
  }
});
