import Ember from 'ember';
import layout from '../templates/components/class-item-long';
import ClassItemBase from './class-item-base';

export default ClassItemBase.extend({
  // ----- Overridden properties -----
  classNames: ['classItemLong'],
  layout
});
