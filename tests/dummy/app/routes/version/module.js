/* jshint ignore:start */

import Ember from 'ember';

const {
  Route,
  RSVP
} = Ember;

import {deserialize} from 'yuidork/utils/de-serialize';


export default Route.extend({

  // ----- Overridden methods -----
  model ({moduleId}) {
    const parentModel   = this.modelFor('version');
    
    moduleId = deserialize(moduleId);
    
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
