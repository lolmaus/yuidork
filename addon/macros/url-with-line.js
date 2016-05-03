import Ember from 'ember';

const {
  computed
} = Ember;

export default function () {
  return computed(
    'line',
    'file.gitHubUrl',
    function () {
      const line      = this.get('line');
      const gitHubUrl = this.get('file.gitHubUrl');

      return `${gitHubUrl}#L${line}`;
    }
  );
}
