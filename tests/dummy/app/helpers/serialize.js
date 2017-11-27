import Ember from 'ember';

import {serialize as serializeUtil} from 'yuidork/utils/de-serialize';

export function serialize([str]/*, hash*/) {
  return str && serializeUtil(str);
}

export default Ember.Helper.helper(serialize);
