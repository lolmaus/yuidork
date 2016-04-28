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



  // ----- Overridden properties -----
  queryParams: {
    path: {
      refreshModel: true
    }
  },



  // ----- Overridden methods -----
  model ({owner, repo, version}, {queryParams: {path = '*root*'}}) {
    const loadingStages = LoadingStages.create();

    this.controllerFor('loading').setProperties({
      owner, repo, versionName: version,
      loadingStages: loadingStages.get('stages')
    });

    const refresh = this.refresh.bind(this);

    return this
      .get('ajaxYuidoc')
      .retrieve({owner, repo, version, path, loadingStages, refresh})
      .then(yuiStuff => ({
        ...yuiStuff,
        owner,
        repo,
        versionName: version
      }));
  }
});
