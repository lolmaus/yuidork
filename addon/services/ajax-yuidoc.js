import Ember from 'ember';

const {
  A,
  RSVP,
  inject: {service},
  Object: EObject,
  run: {later}
} = Ember;

import AjaxService from 'ember-ajax/services/ajax';

import endsWith     from 'yuidork/utils/ends-with';
import values       from 'yuidork/utils/values';
import YuidocParser from 'yuidork/yuidoc-parser';

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
  laterPromise (callback) {
    const deferred = RSVP.defer();

    later(() => {
      const result = callback();
      deferred.resolve(result);
    });

    return deferred.promise;
  },



  requestTrees ({owner, repo, version}) {
    const url = `/repos/${owner}/${repo}/git/trees/${version}?recursive=1`;
    return this.request(url);
  },

  discardIrrelevantFiles({files, path: requestedPath}) {
    return files.filter(({path: currentPath}) => this.shouldIncludeFile({requestedPath, currentPath}));
  },

  discardEmptyFiles(files) {
    return files.filter(({content}) => typeof content === 'string');
  },

  shouldIncludeFile ({requestedPath, currentPath}) {
    if (requestedPath !== '*root*' && currentPath.lastIndexOf(requestedPath, 0) !== 0) {
      return false;
    }

    const segments = A(currentPath.split('/'));
    return (
      this.get('extensions').any(ext => endsWith(currentPath, `.${ext}`))
      && !segments.contains('tests')
      && !segments.contains('vendor')
    );
  },

  retrieveFiles ({owner, repo, version, files, currentStage}) {
    let count = 0;

    if (currentStage) {
      currentStage.set('current', count);
      currentStage.set('total',   files.length);
    }

    const promises =
      files
        .map(file =>
          this
            .retrieveFile({owner, repo, version, file})
            .then(result => {
              count++;
              currentStage.set('current', count);
              return result;
            })
        );

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
    return data;
  },

  getVersionRecord ({owner, repo, version}) {
    const store       = this.get('store');

    const id = `${owner}/${repo}/${version}`;

    let versionRecord = store.peekRecord('yuidoc-version', id);

    if (versionRecord) {
      return {versionRecord, existing: true};
    }

    versionRecord = store.push({
      data: {
        id:         id,
        type:       'yuidoc-version',
        attributes: {owner, repo, version}
      }
    });

    return {versionRecord, existing: false};
  },

  jsonApiBelongsTo (id, type) {
    if (!id) {
      return;
    }

    return {
      data: {id, type}
    };
  },

  jsonApiHasMany (items, type) {
    if (!items || !items.length) {
      return;
    }

    return {
      data: Object.keys(items).map(id => ({id, type}))
    };
  },

  populateFiles ({files, version}) {
    const store = this.get('store');

    return store.push({
      data: values(files).map(file => ({
        id:   file.name,
        type: 'yuidoc-file',
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
          access:      classItem.access,
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

  populateStore ({data, versionRecord}) {
    console.debug('Parsing result', data);

    const version = versionRecord.get('id');

    const {
      files,
      modules,
      classes,
      classitems: classItems
    } = data;

    this.populateFiles     ({files,      version});
    this.populateModules   ({modules,    version});
    this.populateClasses   ({classes,    version});
    this.populateClassItems({classItems, version});

    return {versionRecord};
  },

  getLSBaseKey ({owner, repo, version, path}) {
    return `yuidork/${owner}/${repo}/${version}*${path}`;
  },

  lookupCachedData({owner, repo, version, path}) {
    const baseKey = this.getLSBaseKey({owner, repo, version, path});
    const key     = `${baseKey}*json`;

    return localStorage.getItem(key);
  },

  lookupCachedSha({owner, repo, version, path}) {
    const baseKey = this.getLSBaseKey({owner, repo, version, path});
    const key     = `${baseKey}*sha`;

    return localStorage.getItem(key);
  },

  lookupCachedTree({owner, repo, version, path}) {
    const baseKey = this.getLSBaseKey({owner, repo, version, path});
    const key     = `${baseKey}*tree`;
    return localStorage.getItem(key);
  },

  lookupAndPurgeCachedTree({owner, repo, version, path}) {
    const baseKey = this.getLSBaseKey({owner, repo, version, path});
    const key     = `${baseKey}*tree`;
    const tree    =  localStorage.getItem(key);

    localStorage.removeItem(key);
    return JSON.parse(tree);
  },

  cacheData({owner, repo, version, data, sha}) {
    const baseKey        = this.getLSBaseKey({owner, repo, version});
    const dataKey        = `${baseKey}*json`;
    const shaKey         = `${baseKey}*sha`;
    const serializedData = JSON.stringify(data);

    try {
      localStorage.setItem(dataKey, serializedData);
      localStorage.setItem(shaKey, sha);
    } catch (e) {
      if (e.name !== 'QuotaExceededError') {
        throw e;
      }
    }

    return data;
  },

  cacheTree({owner, repo, version, path, response}) {
    const baseKey        = this.getLSBaseKey({owner, repo, version, path});
    const dataKey        = `${baseKey}*json`;
    const shaKey         = `${baseKey}*sha`;
    const treeKey        = `${baseKey}*tree`;

    const serializedTree = JSON.stringify(response);

    localStorage.removeItem(dataKey);
    localStorage.setItem(shaKey,  response.sha);
    localStorage.setItem(treeKey, serializedTree);
  },

  backgroundRetrieveFromGitHub ({owner, repo, version, path, refresh}) {
    this
      .requestTrees({owner, repo, version})
      .then(response => {
        const cachedSha = this.lookupCachedSha({owner, repo, version, path});

        if (cachedSha === response.sha) {
          return;
        }

        if (!confirm("The git tree you're viewing has been updated. Reload?")) {
          return;
        }

        this.cacheTree({owner, repo, version, path, response});
        refresh();
      });
  },




  retrieve ({owner, repo, version, path, loadingStages, refresh}) {
    const {versionRecord, existing} = this.getVersionRecord({owner, repo, version});

    if (existing && !this.lookupCachedTree({owner, repo, version, path})) {
      return RSVP.resolve({versionRecord});
    }

    return this

      .retrieveFromCacheOrGitHub({owner, repo, version, path, loadingStages, refresh})

      .then(data => loadingStages.next(
        'Loading documentation into the store...',
        () => this.populateStore({data, versionRecord})
      ));
  },

  retrieveFromCacheOrGitHub ({owner, repo, version, path, loadingStages, refresh}) {
    return loadingStages
      .next(
        'Looking up cached documentation...',
        () => {
          return this.lookupCachedData({owner, repo, version, path});
        }
      )
      .then(data => {
        if (data) {
          this.backgroundRetrieveFromGitHub({owner, repo, version, path, refresh});
          return this.deserializeData({data, loadingStages});
        }

        return this.retrieveFromGitHub({owner, repo, version, path, loadingStages});
      });
  },

  deserializeData ({data, loadingStages}) {
    return loadingStages
      .next(
        'Found! Deserializing...',
        () => {
          return JSON.parse(data);
        }
      );
  },

  retrieveFromGitHub({owner, repo, version, path, loadingStages}) {
    let _sha;

    return loadingStages
      .next(
        'Not found! Retrieving list of files from GitHub...',
        () => this.retrieveTreeFromCacheOrGithub({owner, repo, version, path})
      )

      .then(({tree: files, sha}) => loadingStages.next(
        'Discarding irrelevant files...',
        () => {
          _sha = sha;
          return this.discardIrrelevantFiles({files, path});
        }
      ))

      .then(files => loadingStages.next(
        'Retrieving files from GitHub...',
        currentStage => this.retrieveFiles({owner, repo, version, files, currentStage})
      ))

      .then(files => loadingStages.next(
        'Discarding empty files...',
        () => this.discardEmptyFiles(files)
      ))

      .then(files => loadingStages.next(
        'Extracting documentation...',
        () => this.transformFiles(files)
      ))

      .then(data => loadingStages.next(
        'Caching...',
        () => this.cacheData({owner, repo, version, data, sha: _sha})
      ));
  },

  retrieveTreeFromCacheOrGithub ({owner, repo, version, path}) {
    const tree = this.lookupAndPurgeCachedTree({owner, repo, version, path});

    if (tree) {
      return tree;
    }

    return this.requestTrees({owner, repo, version});
  }
});
