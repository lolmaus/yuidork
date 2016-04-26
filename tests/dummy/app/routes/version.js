/* jshint ignore:start */

import Ember from 'ember';

const {
  A,
  inject: {service},
  Route,
  RSVP
} = Ember;

import LoadingStages from 'yuidork/misc/loading-stages';


export default Route.extend({

  // ----- Services -----
  ajaxYuidoc: service('ajax-yuidoc'),



  // ----- Overridden methods -----
  model ({owner, repo, version}) {
    const loadingStages = LoadingStages.create();

    this.controllerFor('loading').set('loadingStages', loadingStages.get('stages'));

    return this
      .get('ajaxYuidoc')
      .retrieve({owner, repo, version, loadingStages})
      .then(yuiStuff => ({
        ...yuiStuff,
        owner,
        repo,
        versionName: version
      }));
  }
});
