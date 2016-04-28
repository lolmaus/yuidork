// Contains code snippets borrowed from runspired/flexi, specifically
// https://github.com/runspired/flexi/blob/develop/addon/services/device/layout.js

import Ember from 'ember';

const {
  computed,
  Mixin,
  on,
  run: {scheduleOnce}
} = Ember;

export default Mixin.create({

  // ----- Arguments -----
  eqSlices: {
       0:  'xxs',
     200:   'xs',
     400:    's',
     600:    'm',
     800:    'l',
    1000:   'xl',
    1200:  'xxl',
    1400: 'xxxl',
  },



  // ----- Overridden properties -----
  attributeBindings: [
     'eqSliceCurrent:data-eq-current',
       'eqSlicesFrom:data-eq-from',
         'eqSlicesTo:data-eq-to',
    'eqSlicesBetween:data-eq-between'
  ],



  // ----- Static properties -----
  eqWidth: null,



  // ----- Computed properties -----
  eqBreakpointsAsc: computed('eqSlices', function () {
    const eqSlices = this.get('eqSlices');

    return Object
      .keys(eqSlices)
      .map(bp => parseInt(bp, 10))
      .sort((a, b) => (a - b));
  }),

  eqBreakpointsDesc: computed('eqBreakpointsAsc.[]', function () {
    return this
      .get('eqBreakpointsAsc')
      .slice()
      .reverse();
  }),

  eqBPCurrent: computed('eqBreakpointsDesc.[]', 'eqWidth', function () {
    const eqWidth = this.get('eqWidth');

    if (eqWidth == null) {
      return null;
    }

    return this
      .get('eqBreakpointsDesc')
      .find(bp => bp <= eqWidth);
  }),

  eqBPCurrentIndex: computed('eqBreakpointsAsc.[]', 'eqBPCurrent', function () {
    const eqBPCurrent      = this.get('eqBPCurrent');

    if (eqBPCurrent == null) {
      return null;
    }

    const eqBreakpointsAsc = this.get('eqBreakpointsAsc');
    return eqBreakpointsAsc.indexOf(eqBPCurrent);
  }),

  eqBPsFrom: computed(
    'eqBreakpointsAsc.[]',
    'eqBPCurrentIndex',
    function () {
      const eqBPCurrentIndex = this.get('eqBPCurrentIndex');

      if (eqBPCurrentIndex == null) {
        return null;
      }

      const eqBreakpointsAsc = this.get('eqBreakpointsAsc');

      return eqBreakpointsAsc
        .slice(0, eqBPCurrentIndex + 1);
    }
  ),

  eqBPsTo: computed(
    'eqBreakpointsAsc.[]',
    'eqBPCurrentIndex',
    function () {
      const eqBPCurrentIndex = this.get('eqBPCurrentIndex');

      if (eqBPCurrentIndex == null) {
        return null;
      }

      const eqBreakpointsAsc = this.get('eqBreakpointsAsc');

      return eqBreakpointsAsc
        .slice(eqBPCurrentIndex);
    }
  ),

  eqBPsBetween: computed(
    'eqBreakpointsAsc.[]',
    'eqBPCurrentIndex',
    function () {
      const eqBPCurrentIndex = this.get('eqBPCurrentIndex');

      if (eqBPCurrentIndex == null) {
        return null;
      }

      const eqBreakpointsAsc = this.get('eqBreakpointsAsc');

      const result = [];

      eqBreakpointsAsc
        .slice(0, eqBPCurrentIndex + 1)
        .forEach(bp1 => {
          eqBreakpointsAsc
            .slice(eqBPCurrentIndex)
            .forEach(bp2 => {
              result.push([bp1, bp2]);
            });
        });

      return result;
    }
  ),

  eqSliceCurrent: computed('eqSlices', 'eqBPCurrent', function () {
    const eqBPCurrent = this.get('eqBPCurrent');
    return this.eqSliceForBP(eqBPCurrent);
  }),

  eqSlicesFrom: computed('eqSlices', 'eqBPsFrom.[]', function () {
    const eqBPsFrom = this.get('eqBPsFrom');

    if (eqBPsFrom == null) {
      return null;
    }

    return this.eqSlicesForBPs(eqBPsFrom);
  }),

  eqSlicesTo: computed('eqSlices', 'eqBPsTo.[]', function () {
    const eqBPsTo = this.get('eqBPsTo');

    if (eqBPsTo == null) {
      return null;
    }
    return this.eqSlicesForBPs(eqBPsTo);
  }),

  eqSlicesBetween: computed('eqSlices', 'eqBPsBetween.[]', function () {
    const eqBPsBetween = this.get('eqBPsBetween');

    if (eqBPsBetween == null) {
      return null;
    }

    return eqBPsBetween
      .map(([bp1, bp2]) => {
        const slice1 = this.eqSliceForBP(bp1);
        const slice2 = this.eqSliceForBP(bp2);

        return `${slice1}-${slice2}`;
      })
      .join(' ');
  }),


  // ----- Custom methods -----
  eqSliceForBP (bp) {
    return this.get('eqSlices')[bp];
  },

  eqSlicesForBPs (bps) {
    return bps
      .map(bp => this.eqSliceForBP(bp))
      .join(' ');
  },

  updateEqWidth() {
    const eqWidth = this.get('element').offsetWidth;
    this.setProperties({eqWidth});
  },



  // ----- Events -----
  _setupEqResize: on('didInsertElement', function () {
    const _eqResizeHandler = () => {
      scheduleOnce('afterRender', this, this.updateEqWidth);
    };

    this.setProperties({_eqResizeHandler});
    window.addEventListener('resize',    _eqResizeHandler, true);
    window.addEventListener('eq-update', _eqResizeHandler, true);

    _eqResizeHandler();
  }),

  _teardownEqResize: on('willDestroyElement', function () {
    const _eqResizeHandler = this.get('_eqResizeHandler');
    window.removeEventListener('resize',    _eqResizeHandler, true);
    window.removeEventListener('eq-update', _eqResizeHandler, true);
  }),

});
