import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

export default Component.extend({

  // ----- Argumnents -----
  icon:  null,
  title: null,



  // ----- Overridden properties -----
  tagName:           'img',
  attributeBindings: ['src', 'title'],



  // ----- Computed properties -----
  src: computed('src', function () {
    const iconName = this.get('icon');

    if (!iconName || !iconName.length) {
      throw new Error('fugue-icon component used without an `icon` attribute (should be non-empty string)');
    }

    return `https://lolmaus.github.io/fugue-icons/icons/${iconName}.png`;
  })
});
