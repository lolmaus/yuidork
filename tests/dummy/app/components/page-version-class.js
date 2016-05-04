import Ember from 'ember';

const {
  A,
  Component,
  computed,
} = Ember;

import eqMixin from 'ember-element-query/mixin';
import layout  from '../templates/components/page-version-class';

export default Component.extend(eqMixin, {

  // ----- Arguments -----
  currentClass: null,



  // ----- Overridden properties -----
  classNames: ['pageVersionClass'],
  layout,

  scrollableItemListHtmlClass: computed('eqSlicesFrom.[]', function () {
    const eqSlicesFrom = this.get('eqSlicesFrom');
    
    return (
      A(eqSlicesFrom).contains('xl')
      ? ".classItems-items"
      : ".layoutDefault-content"
    );
  }),
});
