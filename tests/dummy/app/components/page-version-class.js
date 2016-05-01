import Ember from 'ember';

const {
  A,
  Component,
  computed,
} = Ember;

import eqMixin from '../mixins/e-q';
import layout  from '../templates/components/page-version-class';

export default Component.extend(eqMixin, {

  // ----- Arguments -----
  currentClass: null,



  // ----- Overridden properties -----
  classNames: ['pageVersionClass'],
  layout,



  // ----- Computed properties -----
  urlWithLine: computed(
    'currentClass.line',
    'currentClass.file.gitHubUrl',
    function () {
      const line      = this.get('currentClass.line');
      const gitHubUrl = this.get('currentClass.file.gitHubUrl');

      return `${gitHubUrl}#L${line}`;
    }
  ),

  scrollableItemListHtmlClass: computed('eqSlicesFrom.[]', function () {
    const eqSlicesFrom = this.get('eqSlicesFrom');

    console.log({eqSlicesFrom})
    return (
      A(eqSlicesFrom).contains('xl')
      ? ".classItems-items"
      : ".layoutDefault-content"
    );
  }),
});
