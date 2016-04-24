import Ember from 'ember';

const {
  A,
  RSVP,
  inject: {service},
} = Ember;

import AjaxService from 'ember-ajax/services/ajax';

import endsWith     from 'ember-yuidoc-frontend/utils/ends-with';
import values       from 'ember-yuidoc-frontend/utils/values';
import YuidocParser from 'ember-yuidoc-frontend/yuidoc-parser';

export default AjaxService.extend({


  // ----- Services -----
  store: service(),



  // ----- Overridden properties -----
  headers: {
    Accept: 'application/vnd.github.v3+json'
  },

  host: 'https://api.github.com',



  // ----- Custom properties -----
  extensions:  A(['js', 'jsx', 'coffee']),





  // ----- Custom methods -----




  requestTrees ({owner, repo, version}) {
    const url = `/repos/${owner}/${repo}/git/trees/${version}?recursive=1`;
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

  retrieveFiles ({owner, repo, version, files}) {
    const promises = files.map(file => this.retrieveFile({owner, repo, version, file}));
    return RSVP.all(promises);
  },

  retrieveFile ({owner, repo, version, file}) {
    const url     = `https://cdn.rawgit.com/${owner}/${repo}/${version}/${file.path}`;
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

  getVersionRecord (version) {
    const store       = this.get('store');
    let versionRecord = store.peekRecord('yuidoc-version', version);

    if (versionRecord) {
      return {versionRecord, existing: true};
    }

    versionRecord = store.push({
      data: {
        id:   version,
        type: 'yuidoc-version'
      }
    });

    return {versionRecord, existing: false};
  },

  jsonApiBelongsTo (id, type) {
    return {
      data: {id, type}
    };
  },

  jsonApiHasMany (items, type) {
    if (!items) {
      return;
    }

    return {
      data: Object.keys(items).map(id => ({id, type}))
    };
  },

  populateFiles ({files, version}) {
    const store = this.get('store');

    return store.push({
      data: files.map(file => ({
        id:   file.path,
        type: 'yuidoc-file',
        attributes: {
          content:      file.content,
          sha:          file.sha,
          size:         file.size,
          gitHubApiUrl: file.url
        },
        relationships: {
          version: this.jsonApiBelongsTo(version, 'yuidoc-version')
        }
      }))
    });
  },

  populateModules ({modules, version}) {
    const store        = this.get('store');
    const modulesArray = values(modules);

    const namespacesArray =
      A(modulesArray)
        .mapBy('namespaces')
        .reduce((result, obj) => result.addObjects(Object.keys(obj)), A());

    return store.push({
      data:
        modulesArray
          .map(module => ({
            id:   module.name,
            type: 'yuidoc-module',
            attributes: {
              description: module.description,
              isMain:      module._main,
              itemType:    module.itemtype,
              tag:         module.tag,
              line:        module.line,
            },
            relationships: {
              version: this.jsonApiBelongsTo(version,     'yuidoc-version'),
              file:    this.jsonApiBelongsTo(module.file, 'yuidoc-file'),

              classes:    this.jsonApiHasMany(module.classes,    'yuidoc-class'),
              namespaces: this.jsonApiHasMany(module.namespaces, 'yuidoc-namespace'),
              submodules: this.jsonApiHasMany(module.submodules, 'yuidoc-module'),
            }
          })),

      included:
        namespacesArray
          .map(id => ({
            id,
            type: 'yuidoc-namespace',
            relationships: {
              version: this.jsonApiBelongsTo(version, 'yuidoc-version'),
            }
          }))
    });
  },

  populateClasses ({classes, version}) {
    const store = this.get('store');

    return store.push({
      data: values(classes).map(klass => ({
        id:   klass.name,
        type: 'yuidoc-class',
        attributes: {
          description: klass.description,
          line:        klass.line,
        },
        relationships: {
          version:   this.jsonApiBelongsTo(version,         'yuidoc-version'),
          file:      this.jsonApiBelongsTo(klass.file,      'yuidoc-file'),
          module:    this.jsonApiBelongsTo(klass.module,    'yuidoc-module'),
          namespace: this.jsonApiBelongsTo(klass.namespace, 'yuidoc-namespace'),
          extends:   this.jsonApiBelongsTo(klass.extends,   'yuidoc-class'),
        }
      }))
    });
  },

  populateClassItems ({classItems, version}) {
    const store = this.get('store');

    return store.push({
      data: classItems.map(classItem => ({
        id:   `${classItem.class}--${classItem.name}`,
        type: 'yuidoc-class-item',
        attributes: {
          name:        classItem.name,
          description: classItem.description,
          line:        classItem.line,
          itemType:    classItem.itemtype,
          params:      classItem.params,
        },
        relationships: {
          version:   this.jsonApiBelongsTo(version,             'yuidoc-version'),
          file:      this.jsonApiBelongsTo(classItem.file,      'yuidoc-file'),
          module:    this.jsonApiBelongsTo(classItem.module,    'yuidoc-module'),
          namespace: this.jsonApiBelongsTo(classItem.namespace, 'yuidoc-namespace'),
          class:     this.jsonApiBelongsTo(classItem.class,     'yuidoc-class'),
        }
      }))
    });
  },

  populateStore ({data, files, versionRecord}) {
    console.log({data, files, versionRecord})

    const store = this.get('store');

    const version = versionRecord.get('id');
    const {
      modules,
      classes,
      classitems: classItems
    } = data;

    return {
      store,
      version:    versionRecord,
      files:      this.populateFiles     ({files,      version}),
      modules:    this.populateModules   ({modules,    version}),
      classes:    this.populateClasses   ({classes,    version}),
      classItems: this.populateClassItems({classItems, version}),
      namespaces: store.peekAll('yuidoc-namespace').filterBy('version', versionRecord)
    };
  },




  retrieve ({owner, repo, version}) {
    const {versionRecord, existing} = this.getVersionRecord(version);

    if (existing) {
      return RSVP.resolve(versionRecord);
    }

    return this
      .requestTrees({owner, repo, version})
      .then(response        => this.filterFiles(response.tree))
      .then(files           => this.retrieveFiles({owner, repo, version, files}))
      .then(files           => this.transformFiles(files))
      .then(({data, files}) => this.populateStore({data, files, versionRecord}))
      .then(data => {console.log({data});});
  },
});
