/* jshint ignore:start */

import Ember from 'ember';

const {
  A,
  inject: {service},
  Route,
  RSVP
} = Ember;

import _ from 'npm:lodash';

import {deserialize} from 'yuidork/utils/de-serialize';

export default Route.extend({

  // ----- Services -----
  ajaxYuidoc: service('ajax-yuidoc'),



  // ----- Overridden methods -----
  model ({pageId}) {
    const parentModel   = this.modelFor('version');

    pageId = deserialize(pageId);

    const currentPage =
      parentModel
        .versionRecord
        .get('pages')
        .findBy('id', pageId);

    return RSVP.hash({
      ...parentModel,
      currentPage
    })
  },
});
