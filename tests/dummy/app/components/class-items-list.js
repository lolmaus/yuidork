import Ember from 'ember';

const {
  Component,
  computed,
  computed: {filterBy},
} = Ember;

import layout from '../templates/components/class-items-list';

export default Component.extend({

  // ----- Arguments -----
  type:                           'short',
  classItems:                     null,
  classItemsFiltered:             null,
  classRecord:                    null,
  scrollableItemListHtmlClass:    null,
  staticMethodsAreCollapsed:      false,
  staticPropertiesAreCollapsed:   false,
  staticEventsAreCollapsed:       false,
  instanceMethodsAreCollapsed:    false,
  instancePropertiesAreCollapsed: false,
  instanceEventsAreCollapsed:     false,



  // ----- Overridden properties -----
  classNameBindings: [
    ':classItemsList',
    'typeClass'
  ],
  layout,



  // ----- Computed properties -----
  typeClass: computed('type', function () {
    const type = this.get('type');
    return `-${type}`;
  }),
  
  componentName: computed('type', function () {
    const type = this.get('type');
    return `class-item-${type}`;
  }),

  classItemsStatic:   filterBy('classItems', 'static', true),
  classItemsInstance: filterBy('classItems', 'static', false),

  classItemsStaticFiltered:   filterBy('classItemsFiltered', 'static'),
  classItemsInstanceFiltered: filterBy('classItemsFiltered', 'static', false),

  classItemsStaticMethodsFiltered:    filterBy('classItemsStaticFiltered', 'itemType', 'method'),
  classItemsStaticPropertiesFiltered: filterBy('classItemsStaticFiltered', 'itemType', 'property'),
  classItemsStaticEventsFiltered:     filterBy('classItemsStaticFiltered', 'itemType', 'event'),


  classItemsInstanceMethodsFiltered:    filterBy('classItemsInstanceFiltered', 'itemType', 'method'),
  classItemsInstancePropertiesFiltered: filterBy('classItemsInstanceFiltered', 'itemType', 'property'),
  classItemsInstanceEventsFiltered:     filterBy('classItemsInstanceFiltered', 'itemType', 'event'),

  classItemsStaticMethods:    filterBy('classItemsStatic', 'itemType', 'method'),
  classItemsStaticProperties: filterBy('classItemsStatic', 'itemType', 'property'),
  classItemsStaticEvents:     filterBy('classItemsStatic', 'itemType', 'event'),

  classItemsInstanceMethods:    filterBy('classItemsInstance', 'itemType', 'method'),
  classItemsInstanceProperties: filterBy('classItemsInstance', 'itemType', 'property'),
  classItemsInstanceEvents:     filterBy('classItemsInstance', 'itemType', 'event'),
});
