import Ember from 'ember';

const {
  Component,
  computed,
} = Ember;

import ElementQueryMixin from 'ember-element-query/mixins/element-query';
import layout    from '../templates/components/layout-default';

export default Component.extend(ElementQueryMixin, {

  // ----- Arguments -----
  owner:         null,
  repo:          null,
  versionName:   null,
  versionRecord: null,



  // ----- Overridden properties -----
  classNames: ['layoutDefault'],

  classNameBindings: [
    'menuIsExpanded:-menuExpanded:-menuCollapsed',
  ],

  eqTransitionSelectors: computed(() => [
    '.layoutDefault-menu',
    '.layoutDefault-content'
  ]),

  layout,



  // ----- Overwritable properties -----
  menuIsExpanded:  true,
  closeMenuAction: null,



  // ----- Computed properties -----
  ownerUrl: computed('owner', function () {
    const owner = this.get('owner');
    return `https://github.com/${owner}`;
  }),

  repoUrl: computed('ownerUrl', 'repo', function () {
    const ownerUrl = this.get('ownerUrl');
    const repo     = this.get('repo');
    return `${ownerUrl}/${repo}`;
  }),

  versionUrl: computed('repoUrl', 'versionName', function () {
    const repoUrl     = this.get('repoUrl');
    const versionName = this.get('versionName');
    return `${repoUrl }/tree/${versionName}`;
  }),



  // ----- Actions -----
  actions: {
    toggleMenu () {
      this.toggleProperty('menuIsExpanded');
    },

    closeMenu (ignoreOnSmall) {
      if (ignoreOnSmall && this.get('eqWidth') >= 800 ) {
        return;
      }

      this.set('menuIsExpanded', false);
    }
  }


});
