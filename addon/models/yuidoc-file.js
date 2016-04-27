import Ember from 'ember';

const {
  computed,
  computed: {alias}
} = Ember;

import Model                from 'ember-data/model';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default Model.extend({
  
  // ----- Relationships -----
  version:    belongsTo('yuidoc-version', {async: false}),

  classes:    hasMany('yuidoc-class',     {async: false}),
  modules:    hasMany('yuidoc-module',    {async: false}),
  namespaces: hasMany('yuidoc-namespace', {async: false}),



  // ----- Computed properties -----
  name:      alias('id'),
  
  gitHubUrl: computed(
    'name',
    'version.{owner,repo,version}',
    function () {
      const owner   = this.get('version.owner');
      const repo    = this.get('version.repo');
      const version = this.get('version.version');
      const name    = this.get('name');
      
      return `https://github.com/${owner}/${repo}/blob/${version}/${name}`;
    }
  )

});
