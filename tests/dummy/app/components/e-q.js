import Ember from 'ember';

const {
  Component
} = Ember;

import eqMixin from '../mixins/e-q';
import layout from '../templates/components/e-q';

export default Component.extend(eqMixin, {
  layout
});
