import Ember from 'ember';

const {
  Component,
  computed,
} = Ember;

import ElementQueryMixin from 'ember-element-query/mixins/element-query';
import layout  from '../templates/components/page-version-class';

export default Component.extend(ElementQueryMixin, {

  // ----- Arguments -----
  currentClass: null,



  // ----- Overridden properties -----
  classNames: ['pageVersionClass'],
  layout,

  scrollableItemListHtmlClass: computed('eqWidth', function () {
    const eqWidth = this.get('eqWidth');

    return eqWidth >= 1000
      ? ".classItems-items"
      : ".layoutDefault-content";
  }),
});
