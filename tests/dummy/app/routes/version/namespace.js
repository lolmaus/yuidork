/* jshint ignore:start */

import Ember from 'ember';

const {
  Route,
  RSVP
} = Ember;

import {deserialize} from 'yuidork/utils/de-serialize';


export default Route.extend({

  // ----- Overridden methods -----
  model ({namespaceId}) {
    const parentModel   = this.modelFor('version');

    namespaceId = deserialize(namespaceId);

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
