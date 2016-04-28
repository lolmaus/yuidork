import Ember from 'ember';

const {
  Controller,
  computed
} = Ember;

export default Controller.extend({

  // ----- Computed properties -----
  urlWithLine: computed(
    'model.currentClass.line',
    'model.currentClass.file.gitHubUrl',
    function () {
      const line      = this.get('model.currentClass.line');
      const gitHubUrl = this.get('model.currentClass.file.gitHubUrl');

      return `${gitHubUrl}#L${line}`;
    }
  )

});
