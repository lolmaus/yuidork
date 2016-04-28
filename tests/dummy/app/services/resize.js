// Code borrowed from runspired/flexi
// https://github.com/runspired/flexi/blob/develop/addon/services/device/layout.js

import Ember from 'ember';

const {
  Evented,
  Service,
  run: {debounce}
} = Ember;

export default Service.extend(Evented, {
  
  _resizeHandler: null,
  
  setupResize() {
    this._resizeHandler = () => {
      debounce(this, this.handleResize(), 16);
    };
    window.addEventListener('resize', this._resizeHandler, true);
  },
  
  teardownResize() {
    window.removeEventListener('resize', this._resizeHandler, true);
  },
  
  handleResize() {
    this.trigger('resize');
  },
  
  init() {
    this._super();
    this.setupResize();
  },
  
  willDestroy() {
    this._super(...arguments);
    this.teardownResize();
  },
});
