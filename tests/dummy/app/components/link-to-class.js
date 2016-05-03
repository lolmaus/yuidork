import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

import layout from '../templates/components/link-to-class';

export default Component.extend({

  // ----- Arguments -----
  className:     null,
  versionRecord: null,



  // ----- Overridden properties -----
  classNames: ['linkToClass'],
  layout,



  // ----- Computed properties -----
  classRecord: computed(
    'className',
    'versionRecord.classes.@each.name',
    function () {
      const className = this.get('className');

      return this
        .get('versionRecord.classes')
        .findBy('name', className);
    }
  )
});
