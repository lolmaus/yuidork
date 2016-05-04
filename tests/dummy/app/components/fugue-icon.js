import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

import layout from '../templates/components/fugue-icon';

export default Component.extend({

  // ----- Argumnents -----
  type:     null,
  value:    null,
  withText: false,



  // ----- Overridden properties -----
  classNameBindings: [
    ':fugueIcon',
    'dimmedClass'
  ],
  layout,



  // ----- Static properties -----
  types: {
    itemType: {
      method:   'document--arrow',
      property: 'document--pencil',
      event:    'document-clock',
      unknown:  'document',
    },

    access: {
      public:    'lock-unlock',
      protected: 'lock--plus',
      private:   'lock--minus',
    },

    inherited: {
      overridden: 'chain--pencil',
      inherited:  'chain',
      false:      'chain',
    },

    static:     'ice',
    deprecated: 'broom',
    final:      'stamp',
    computed:   'gear',
    observer:   'eye',
    on:         'service-bell',
    optional:   'ghost',
    mixin:      'water',
  },

  titles: {
    itemType: {
      method:   'Method',
      property: 'Property',
      event:    'Event',
      unknown:  'Unknown',
    },

    access: {
      public:    'Public',
      protected: 'Protected',
      private:   'Private',
    },

    inherited: {
      overridden: 'Inherited but overridden',
      inherited:  'Inherited',
      false:      'Own',
    },

    static: {
      true:  'Static',
      false: 'Instance'
    },

    deprecated: {
      true:  'Deprecated',
      false: 'Not deprecated'
    },

    final: {
      true:  'Final',
      false: 'Not final'
    },

    computed: {
      true:  'Computed',
    },

    observer: {
      true:  'Observer',
    },

    on: {
      true:  'Ember.on',
    },

    optional: {
      true:  'Optional',
    },

    mixin: {
      true:  'Mixin',
    },
  },

  dimmeds: {
    access: {
      public: true,
    },

    inherited: {
      false: true,
    },

    static: {
      false: true
    },

    deprecated: {
      false: true
    },
  },



  // ----- Computed properties -----
  icon: computed('type', 'value', 'types', function () {
    const type = this.get('type');

    if (!type) {
      return null;
    }

    const types = this.get('types');

    const typeGroup = types[type] || types['unknonw'];

    if ((typeof typeGroup) === 'string') {
      return typeGroup;
    }

    const value = this.get('value') || false;
    return typeGroup[value];
  }),

  title: computed('type', 'value', 'titles', function () {
    const type = this.get('type');

    if (!type) {
      return null;
    }

    const titles = this.get('titles');

    const typeGroup = titles[type] || titles['unknown'];

    if ((typeof typeGroup) === 'string') {
      return typeGroup;
    }

    const value = this.get('value') || false;
    return typeGroup[value];
  }),

  dimmedClass: computed('type', 'value', 'dimmeds', function () {
    const type = this.get('type');

    if (!type) {
      return null;
    }

    const dimmeds = this.get('dimmeds');

    const typeGroup = dimmeds[type] || dimmeds['unknown'];

    if (!typeGroup) {
      return null;
    }

    const value = this.get('value') || false;

    if (!typeGroup[value]) {
      return null;
    }

    return '-dimmed';
  }),



  src: computed('icon', 'type', function () {
    const icon = this.get('icon');

    return `https://lolmaus.github.io/fugue-icons/icons/${icon}.png`;
  }),
});
