import Ember from 'ember';

const {
  inject: {service},
  Route,
} = Ember;


export default Route.extend({

  // ----- Services -----
  ajaxYuidoc: service('ajax-yuidoc'),



  // ----- Overridden methods -----
  model ({owner, repo, version}) {
    return this
      .get('ajaxYuidoc')
      .retrieve({owner, repo, version});
  }
});
