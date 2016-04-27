/* jshint ignore:start */

import Ember from 'ember';

const {
  Route,
  RSVP
} = Ember;


export default Route.extend({

  // ----- Overridden methods -----
  model ({namespaceId}) {
    const parentModel   = this.modelFor('version');

    const currentNamespace =
      parentModel
        .versionRecord
        .get('namespaces')
        .findBy('id', namespaceId);

    return RSVP.hash({
      ...parentModel,
      currentNamespace
    })
  }
});
