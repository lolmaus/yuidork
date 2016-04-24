import Ember from 'ember';

const {
  A,
  RSVP,
} = Ember;

import AjaxService from 'ember-ajax/services/ajax';
import endsWith from 'ember-yuidoc-frontend/utils/ends-with';
import YuidocParser from 'ember-yuidoc-frontend/yuidoc-parser';

export default AjaxService.extend({


  // ----- Overridden properties -----
  headers: {
    Accept: 'application/vnd.github.v3+json'
  },

  host: 'https://api.github.com',



  // ----- Custom properties -----
  extensions:  A(['js', 'jsx', 'coffee']),





  // ----- Custom methods -----




  requestTrees ({owner, repo, tree}) {
    const url = `/repos/${owner}/${repo}/git/trees/${tree}?recursive=1`;
    return this.request(url);
  },

  filterFiles(files) {
    return files.filter(({path}) => this.shouldIncludeFile(path));
  },

  shouldIncludeFile (path) {
    return this
      .get('extensions')
      .any(ext => endsWith(path, `.${ext}`));
  },

  retrieveFiles ({owner, repo, tree, files}) {
    const promises = files.map(file => this.retrieveFile({owner, repo, tree, file}));
    return RSVP.all(promises);
  },

  retrieveFile ({owner, repo, tree, file}) {
    const url     = `https://cdn.rawgit.com/${owner}/${repo}/${tree}/${file.path}`;
    const content = this.request(url, {dataType: 'text'});

    return RSVP
      .hash({file, content})
      .then(({file, content}) => {
        file.content = content;
        return file;
      });
  },

  transformFiles (files) {
    const yuidocParser = YuidocParser.create();
    const data         = yuidocParser.parse(files);
    return {data, files};
  },



  retrieve ({owner, repo, tree}) {
    return this
      .requestTrees({owner, repo, tree})
      .then((response) => this.filterFiles(response.tree))
      .then((files)    => this.retrieveFiles({owner, repo, tree, files}))
      .then((files)    => this.transformFiles(files))
      .then(({data})   => {console.log({data, this: this});});
  },
});
