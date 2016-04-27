import Ember from 'ember';

const {
  Controller,
  computed
} = Ember;

export default Controller.extend({

  // ----- Computed properties -----
  urlWithLine: computed(
    'item.line',
    'item.file.gitHubUrl',
    function () {
      const line      = this.get('item.line');
      const gitHubUrl = this.get('item.file.gitHubUrl');

      return `${gitHubUrl}#L${line}`;
    }
  )

});
