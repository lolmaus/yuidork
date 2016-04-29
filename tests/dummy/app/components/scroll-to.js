import Ember from 'ember';

const {
  computed,
  on,
  run,
} = Ember;

import ScrollToComponent from 'ember-scroll-to/components/scroll-to';
import layout            from 'ember-scroll-to/templates/scroll-to';

export default ScrollToComponent.extend({


  // ----- Arguments -----
  href:       null,      // Required
  duration:   undefined,
  easing:     undefined,
  offset:     undefined,
  scrollable: 'html, body',



  // ----- Overridden properties -----
  layout,



  // ----- Computed properties -----
  $scrollable: computed('scrollable', function () {
    const scrollable = this.get('scrollable');
    return $(scrollable);
  }),


  // ----- Events -----
  scroll: on('click', function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const $scrollable = this.get('$scrollable');
    const scroller    = this.get('scroller');
    const $element    = this.get('jQueryElement');

    scroller.set('scrollable', $scrollable);

    scroller
      .scrollVertical($element, {
        duration: this.get('duration'),
        offset:   this.get('offset'),
        easing:   this.get('easing'),
        complete: () => run(this, this.sendAction, 'afterScroll')
      });
  })
});
