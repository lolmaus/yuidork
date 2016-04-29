import Ember from 'ember';

import ScrollerService from 'ember-scroll-to/services/scroller';

export default ScrollerService.extend({

  getVerticalCoord (target, offset = 0) {
    const $scrollable = this.get('scrollable');
    const $element    = this.getJQueryElement(target);

    const scrollableOffset    = $scrollable.offset().top;
    const scrollableScrollTop = $scrollable.scrollTop();
    const elementOffset       = $element.offset().top;

    const verticalCoord = elementOffset - scrollableOffset + scrollableScrollTop + offset;
    return verticalCoord;
  },



  scrollVertical (target, opts = {}) {
    const $scrollable = this.get('scrollable');

    const scrollTop = this.getVerticalCoord(target, opts.offset)

    $scrollable.animate(
      {scrollTop},
      opts.duration || this.get('duration'),
      opts.easing   || this.get('easing'),
      opts.complete
    );
  }
});
