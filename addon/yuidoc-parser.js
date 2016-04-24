import Ember from 'ember';

const {
  A,
  assign,
  isArray,
  isFunction,
  Object: EmberObject,
  String: {capitalize}
} = Ember;

export default EmberObject.extend({

  CURRENT_MODULE:    null,
  MAIN_MODULE:       null,
  CURRENT_SUBMODULE: null,
  CURRENT_CLASS:     null,
  CURRENT_NAMESPACE: null,
  CURRENT_FILE:      null,
  lastnamespace:     null,
  CLASSES:           {},
  ELEMENTS:          {},
  FILES:             {},
  MODULES:           {},
  PROJECT:           {},
  CLASSITEMS:        [],


  REGEX_LINES:        /\r\n|\n/,
  REGEX_TYPE:         /(.*?)\{(.*?)\}(.*)/,
  REGEX_GLOBAL_LINES: /\r\n|\n/g,
  REGEX_FIRSTWORD:    /^\s*?(\[.+\]\*?|[^\s]+)(.*)/,
  REGEX_OPTIONAL:     /^\[(.*)\]$/,

  REGEX_START_COMMENTS: {
    js:     /^\s*\/\*\*/,
    jsx:    /^\s*\/\*\*/,
    coffee: /^\s*###\*/
  },

  REGEX_END_COMMENTS: {
    js:     /\*\/\s*$/,
    jsx:    /\*\/\s*$/,
    coffee: /###\s*$/
  },

  REGEX_LINE_HEAD_CHARS: {
    js:     /^\s*\*/,
    jsx:    /^\s*\*/,
    coffee: /^\s*[#\*]/
  },

  IGNORE_TAGS: A([
    'media'
  ]),

  SHORT_TAGS: A([
    'async',
    'beta',
    'chainable',
    'extends',
    'final',
    'static',
    'optional',
    'required'
  ]),

  TAGS: A([
    'async',        // bool, custom events can fire the listeners in a setTimeout
    'author',       // author best for projects and modules, but can be used anywhere // multi
    'attribute',    // YUI attributes / custom element attributes
    'beta',         // module maturity identifier
    'broadcast',    // bool, events
    'bubbles',      // custom events that bubble
    'category',     // modules can be in multiple categories
    'chainable',    // methods that return the host object
    'class',        // pseudo class
    'conditional',  // conditional module
    'config',       // a config param (not an attribute, so no change events)
    'const',        // not standardized yet, converts to final property
    'constructs',   // factory methods (not yet used)
    'constructor',  // this is a constructor
    'content',      // permitted content for an @element
    'contributor',  // like author
    'default',      // property/attribute default value
    'deprecated',   // please specify what to use instead
    'description',  // can also be free text at the beginning of a comment is
    'emitfacade',   // bool, YUI custom event can have a dom-like event facade
    'element',      // Web Components custom element
    'event',        // YUI custom event
    'evil',         // uses eval
    'extension',    // this is an extension for [entity]
    'extensionfor', // this is an extension for [entity]
    'extension_for',// this is an extension for [entity]
    'example',      // 0..n code snippets.  snippets can also be embedded in the desc
    'experimental', // module maturity identifier
    'extends',      // pseudo inheritance
    'file',         // file name (used by the parser)
    'final',        // not meant to be changed
    'fireonce',     // bool, YUI custom event config allows
    'for',          // used to change class context
    'global',       // declare your globals
    'icon',         // project icon(s)
    'implements',   // Implements Interface
    'in',           // indicates module this lives in (obsolete now)
    'initonly',     // attribute writeonce value
    'injects',      // injects {HTML|script|CSS}
    'interface',    // Is Interface / Interface for an @element
    'knownissue',   // 0..n known issues for your consumption
    'line',         // line number for the comment block (used by the parser)
    'method',       // a method
    'module',       // YUI module name
    'main',         // Description for the module
    'namespace',    // Y.namespace, used to fully qualify class names
    'optional',     // For optional attributes
    'required',     // For required attributes
    'param',        // member param
    'parents',      // permitted parents for an @element
    'plugin',       // this is a plugin for [entityl]
    'preventable',  // YUI custom events can be preventable ala DOM events
    'private',      // > access
    'project',      // project definition, one per source tree allowed
    'property',     // a regular-ole property
    'protected',    // > access
    'public',       // > access
    'queuable',     // bool, events
    'readonly',     // YUI attribute config
    'requires',     // YUI module requirements
    'return',       // {type} return desc -- returns is converted to this
    'see',          // 0..n things to look at
    'since',        // when it was introduced
    'static',       // static
    'submodule',    // YUI submodule
    'throws',       // {execption type} description
    'title',        // this should be something for the project description
    'todo',         // 0..n things to revisit eventually (hopefully)
    'type',         // the var type
    'url',          // project url(s)
    'uses',         // 0..n compents mixed (usually, via augment) into the prototype
    'value',        // the value of a constant
    'writeonce'     // YUI attribute config
  ]),

  CORRECTIONS: {
    'augments':    'uses', // YUI convention for prototype mixins
    'depreciated': 'deprecated', // subtle difference
    'desciption':  'description', // shouldn't need the @description tag at all
    'extend':      'extends', // typo
    'function':    'method', // we may want standalone inner functions at some point
    'member':      'method', // probably meant method
    'parm':        'param', // typo
    'params':      'param', // typo
    'pamra':       'param', // typo
    'parma':       'param', // typo
    'propery':     'property', // typo
    'prop':        'property', // probably meant property
    'returns':     'return' // need to standardize on one or the other
  },

  DIGESTERS: {
    // "params": [
    // {
    //   "name": "optionalandmultiple",
    //   "description": "my desc",
    //   "type": "string",
    //   "optional": true, // [surroundedbybrackets]
    //   "optdefault": "if specified, this is always string to avoid syntax errors @TODO",
    //   "multiple": true // endswith* or ...startswith
    // }
    // ],
    // @param {type} name description    -or-
    // @param name {type} description
    // #2173362 optional w/ or w/o default
    // @param {type} [optvar=default] description
    // #12 document config objects
    // @param {object|config} config description
    // @param {type} config.prop1 description
    // @param {type} config.prop2 description
    // #11 document callback argument signature
    // @param {callback|function} callback description
    // @param {type} callback.arg1 description
    // @param {type} callback.arg2 description
    // #2173362 document event facade decorations for custom events
    // @param {event} event description
    // @param {type}  event.child description
    // @param {type}  event.index description
    // @param name* {type} 1..n description
    // @param [name]* {type} 0..n description
    param (tagname, value, target/*, block*/) {
      target.params = target.params || [];

      if (!value) {
        return;
      }

      const REGEX_TYPE      = this.get('REGEX_TYPE');
      const REGEX_FIRSTWORD = this.get('REGEX_FIRSTWORD');
      const REGEX_OPTIONAL  = this.get('REGEX_OPTIONAL');
      let   desc            = this.implodeString(this.trim(value));
      let   match           = REGEX_TYPE.exec(desc);
      let   host            = target.params;
      let   type;
      let   name;
      let   multiple;
      let   optional;
      let   optdefault;

      // Extract {type}
      if (match) {
        type = capitalize(this.trim(match[2]));
        desc = this.trim(match[1] + match[3]);
      }

      // extract the first word, this is the param name
      match = REGEX_FIRSTWORD.exec(desc);
      if (match) {
        name = this.trim(this.explodeString(match[1]));
        desc = this.trim(match[2]);
      }

      if (!name) {
        if (value && value.match(/callback/i)) {
          name = 'callback';
          type = 'Callback';
        } else {
          name = 'UNKNOWN';
        }
      }

      const len = name.length - 1;

      if (name.charAt(len) === '*') {
        multiple = true;
        name = name.substr(0, len);
      }

      // extract [name], optional param
      if (name.indexOf('[') > -1) {
        match = REGEX_OPTIONAL.exec(name);
        if (match) {
          optional = true;
          name = this.trim(match[1]);
          // extract optional=defaultvalue
          const parts = name.split('=');
          if (parts.length > 1) {
            name = parts[0];
            optdefault = parts[1];
            //Add some shortcuts for object/array defaults
            if (optdefault.toLowerCase() === 'object') {
                optdefault = '{}';
            }
            if (optdefault.toLowerCase() === 'array') {
                optdefault = '[]';
            }
          }
        }
      }

      // This should run after the check for optional parameters
      // and before the check for child parameters
      // because the signature for 0..n params is [...args]
      if (name.substr(0, 3) === '...') {
        multiple = true;
        name = name.substr(3);
      }

      // parse object.prop, indicating a child property for object
      if (name.indexOf('.') > -1) {
        match = name.split('.');
        const parent = this.trim(match[0]);

        target.params.forEach(param => {
          if (param.name !== parent) {
            return;
          }

          param.props = param.props || [];
          host = param.props;
          match.shift();
          name = this.trim(match.join('.'));
          if (match.length <= 1) {
            return;
          }

          const pname = name.split('.')[0];
          let par;

          param.props.forEach(o => {
            if (o.name === pname) {
              par = o;
            }
          });

          if (par) {
            match = name.split('.');
            match.shift();
            name = match.join('.');
            par.props = par.props || [];
            host = par.props;
          }
        });
      }

      const result = {
        name,
        description: this.explodeString(desc)
      };

      if (type) {
        result.type = type;
      }

      if (optional) {
        result.optional = true;
        if (optdefault) {
          result.optdefault = optdefault;
        }
      }

      if (multiple) {
        result.multiple = true;
      }

      host.push(result);
    },

    // @return {type} description // methods
    // @returns {type} description // methods
    // @injects {HTML|CSS|script} description
    // can be used by anthing that has an optional {type} and a description
    return (tagname, value, target) {
      const REGEX_TYPE = this.get('REGEX_TYPE');
      let   desc       = this.implodeString(this.trim(value));
      const match      = REGEX_TYPE.exec(desc);
      let   type;

      if (match) {
        type = capitalize(this.trim(match[2]));
        desc = this.trim(match[1] + match[3]);
      }

      const result = {
        description: this.unindent(this.explodeString(desc))
      };

      if (type) {
        result.type = type;
      }

      target[tagname] = result;
    },

    // @throws {type} description
    throws: 'return',

    injects: 'return',

    // trying to overwrite the constructor value is a bad idea
    constructor (tagname, value, target) {
      target.is_constructor = 1;
    },

    // @author {twitter: @arthurdent | github: ArthurDent}
    //    Arthur Dent adent@h2g2.earth #23, multiple // modules/class/method
    // 'author': function(tagname, value, target, block) {
    //     // Y.log('author digester');
    // },

    // A key bock type for declaring modules and submodules
    // subsequent class and member blocks will be assigned
    // to MODULES.
    module (tagname, value, target, block) {
      this.setCurrentModule(value);

      let go = true;

      A(block).some(o => {
        if (this.trim(o.tag) === 'submodule') {
          go = false;
          return true;
        }
      });

      if (!go) {
        return null;
      }

      if (!this.get('MAIN_MODULE')) {
        this.setMainModule({
          tag:         tagname,
          name:        value,
          file:        target.file,
          line:        target.line,
          description: target.description
        });
      }

      const MODULES = this.get('MODULES');

      return MODULES[value];
    },

    //Setting the description for the module..
    main (tagname, value, target) {
      target.mainName = value;
      target.tag      = tagname;
      target.itemtype = 'main';
      target._main    = true;
      this.setMainModule(target);
    },

    // accepts a single project definition for the source tree
    project () {
      return this.get('PROJECT');
    },

    // A key bock type for declaring submodules.  subsequent class and
    // member blocks will be assigned to this submodule.
    submodule (tagname, value) {
      //console.log('Setting current submodule: ', value, 'on class');
      this.setCurrentSubmodule(value);

      const MODULES = this.get('MODULES');
      const host    = MODULES[value];
      const clazz   = this.get('CURRENT_CLASS');
      const parent  = this.get('CURRENT_MODULE');
      const CLASSES = this.get('CLASSES');

      if (parent) {
        host.module = parent;
      }

      if (clazz && CLASSES[clazz]) {
        CLASSES[clazz].submodule = value;
      }

      return host;
    },

    // A key bock type for declaring classes, subsequent
    // member blocks will be assigned to this class
    class (tagname, value, target, block) {
      let namespace;

      block.forEach(def => {
        if (def.tag !== 'namespace') {
          return;
        }

        //We have a namespace, augment the name
        const name = this.trim(def.value) + '.' + value;

        if (value.indexOf(this.trim(def.value) + '.') === -1) {
          value = name;
          namespace = this.trim(def.value);
        }
      });

      if (namespace) {
        this.setCurrentNamespace(namespace);
      }

      this.setCurrentClass(value);

      const fullname = this.get('CURRENT_CLASS');
      const CLASSES  = this.get('CLASSES');
      let host       = CLASSES[fullname];

      let parent     = this.get('CURRENT_MODULE');

      if (namespace) {
        host.namespace = namespace;
      }
      if (parent) {
        host.module = parent;
      }

      //Merge host and target in case the class was defined in a "for" tag
      //before it was defined in a "class" tag
      assign(host, target);

      CLASSES[fullname] = host;

      parent = this.get('CURRENT_SUBMODULE');

      if (parent) {
        //this.set(CURRENT_SUBMODULE, parent);
        host.submodule = parent;
      }

      return host;
    },

    // A key bock type for declaring custom elements
    element (tagname, value) {
      const name     = value.split(/\s+/)[0];
      const ELEMENTS = this.get('ELEMENTS');
      const host     = ELEMENTS[name];
      let parent     = this.get('CURRENT_MODULE');

      this.set('CURRENT_ELEMENT', name);

      if (parent) {
        host.module = parent;
      }

      parent = this.get('CURRENT_SUBMODULE');

      if (parent) {
        host.submodule = parent;
      }

      return host;
    },

    // change 'const' to final property
    const (tagname, value, target) {
      target.itemtype = 'property';
      target.name     = value;
      target.final    = '';
    },

    // supported classitems
    property (tagname, value, target, block) {
      target.itemtype = tagname;
      target.name     = value;

      if (!target.type) {
        const desc       = this.implodeString(this.trim(value));
        const REGEX_TYPE = this.get('REGEX_TYPE');
        const match      = REGEX_TYPE.exec(desc);

        // Extract {type}
        if (match) {
          target.type = capitalize(this.trim(match[2]));
          target.name = this.trim(match[1] + match[3]);
        }
      }

      if (target.type && target.type.toLowerCase() === 'object') {
        block.forEach((i, k) => {
          if (i.tag !== 'property') {
            return;
          }

          i.value  = this.trim(i.value);
          i.tag    = 'param';
          block[k] = i;
        });
      }
    },

    method: 'property',
    config: 'property',
    event:  'property',

    attribute (tagname, value, target) {
      // Use 'property' if not currently parsing an element
      const CURRENT_ELEMENT = this.get('CURRENT_ELEMENT');
      if (!CURRENT_ELEMENT) {
        const DIGESTERS = this.get('DIGESTERS');
        return DIGESTERS.property.apply(this, arguments);
      }

      const nameVal     = value.split(/\s+([\s\S]*$)/);
      const description = nameVal[1] || target.description || '';

      if (!target.attributes) {
        target.attributes = [];
      }
      target.attributes.push({
        name: nameVal[0],
        description
      });
    },

    // access fields
    public (tagname, value, target) {
      target.access  = tagname;
      target.tagname = value;
    },
    private:   'public',
    protected: 'public',
    inner:     'public',

    // tags that can have multiple occurances in a single block
    todo (tagname, value, target) {
      if (!isArray(target[tagname])) {
        target[tagname] = [];
      }

      //If the item is @tag one,two
      if (value.indexOf(',') > -1) {
        value = value.split(',');
      } else {
        value = [value];
      }

      value.forEach(v => {
        v = this.trim(v);
        target[tagname].push(v);
      });
    },

    extensionfor (tagname, value) {
      const CLASSES       = this.get('CLASSES');
      const CURRENT_CLASS = this.get('CURRENT_CLASS');

      if (CLASSES[CURRENT_CLASS]) {
        CLASSES[CURRENT_CLASS].extension_for.push(value);
      }
    },
    extension_for: 'extensionfor',

    example (tagname, value, target, block) {
      if (!isArray(target[tagname])) {
        target[tagname] = [];
      }

      let e = value;

      block.forEach(v => {
        if (v.tag !== 'example') {
          return;
        }

        if (v.value.indexOf(value) === -1) {
          return;
        }

        e = v.value;
      });

      target[tagname].push(e);
    },

    url:           'todo',
    icon:          'todo',
    see:           'todo',
    requires:      'todo',
    knownissue:    'todo',
    uses:          'todo',
    category:      'todo',
    unimplemented: 'todo',

    genericValueTag (tagname, value, target) {
      target[tagname] = value;
    },

    author:      'genericValueTag',
    contributor: 'genericValueTag',
    since:       'genericValueTag',

    deprecated (tagname, value, target) {
      target.deprecated = true;

      if (typeof value === 'string' && value.length) {
        target.deprecationMessage = value;
      }
    },

    // updates the current namespace
    namespace (tagname, value) {
      this.setCurrentNamespace(value);

      if (value === '') {
        //Shortcut this if namespace is an empty string.
        return;
      }

      var name;

      const file = this.get('CURRENT_FILE');

      if (file) {
        const FILES = this.get('FILES');
        FILES[file].namespaces[value] = 1;
      }

      let   mod     = this.get('CURRENT_MODULE');
      const MODULES = this.get('MODULES');

      if (mod) {
        MODULES[mod].namespaces[value] = 1;
      }

      mod = this.get('CURRENT_SUBMODULE');
      if (mod) {
        MODULES[mod].namespaces[value] = 1;
      }

      mod = this.get('CURRENT_CLASS');
      if (!mod) {
        return;
      }

      const lastNS  = this.get('lastnamespace');
      const CLASSES = this.get('CLASSES');

      if (
        lastNS
        && lastNS !== value
        && (value.indexOf(lastNS + '.') !== 0)
        && CLASSES[mod]
      ) {
        const m = CLASSES[mod];
        delete CLASSES[mod];
        mod          = value + '.' + mod.replace(lastNS + '.', '');
        m.name       = mod;
        m.namespace  = value;
        CLASSES[mod] = m;
        this.setCurrentClass(m.name);
      }

      if (!CLASSES[mod]) {
        return;
      }

      CLASSES[mod].namespace = value;

      if (mod === value) {
        return;
      }

      if (mod.indexOf(value + '.') > -1) {
        return;
      }

      if (mod.indexOf('.') === -1) {
        const m = CLASSES[mod];
        delete CLASSES[mod];
        name          = m.namespace + '.' + m.name;
        m.name        = name;
        CLASSES[name] = m;
        this.setCurrentClass(name);
        return;
      }

      if (mod.indexOf(CLASSES[mod].namespace + '.') > -1) {
        return;
      }

      const m = CLASSES[mod];
      delete CLASSES[mod];
      name               = m.namespace + '.' + m.shortname;
      m.name             = name;
      CLASSES[name] = m;
      this.setCurrentClass(name);
    },

    // updates the current class only (doesn't create
    // a new class definition)
    for (tagname, value) {
      value = this._resolveFor(value);
      this.setCurrentClass(value);
      const CLASSES = this.get('CLASSES');

      const ns = ((CLASSES[value]) ? CLASSES[value].namespace : '');
      this.setCurrentNamespace(ns);

      const file = this.get('CURRENT_FILE');
      if (file) {
        const FILES = this.get('FILES');
        FILES[file].fors[value] = 1;
      }

      let   mod     = this.get('CURRENT_MODULE');
      const MODULES = this.get('MODULES');

      if (mod) {
        MODULES[mod].fors[value] = 1;
      }

      mod = this.get('CURRENT_SUBMODULE');
      if (mod) {
        MODULES[mod].fors[value] = 1;
      }
    }
  },



  setCurrentFile (path) {
    const FILES = this.get('FILES');

    if (!FILES[path]) {
      FILES[path] = {
        name:       path,
        modules:    {},
        classes:    {},
        fors:       {},
        namespaces: {}
      };
    }

    this.set('CURRENT_FILE', path);
    return path;
  },

  setCurrentClass (val) {
    if (!val) {
      this.set('CURRENT_CLASS', val);
      return val;
    }

    val = this.trim(val);

    let name = val;

    const CLASSES = this.get('CLASSES');

    if (!CLASSES[val]) {
      const ns      = this.get('CURRENT_NAMESPACE');

      if (ns && ns !== '' && (val.indexOf(ns + '.') !== 0)) {
        name = ns + '.' + val;
      }

      const clazz = CLASSES[name] = {
        name,
        shortname:     val,
        classitems:    [],
        plugins:       [],
        extensions:    [],
        plugin_for:    [],
        extension_for: []
      };

      clazz.module = this.get('CURRENT_MODULE');

      const CURRENT_SUBMODULE = this.get('CURRENT_SUBMODULE');
      if (CURRENT_SUBMODULE) {
        clazz.submodule = this.get(CURRENT_SUBMODULE);
      }

      clazz.namespace = ns;
    }

    this.set('CURRENT_CLASS', name);
    return name;
  },

  setMainModule (o) {
    if (!o) {
      this.set('MAIN_MODULE', undefined);
      return;
    }

    let write = true;

    const name           = o.mainName || o.name;
    const CURRENT_MODULE = this.get('CURRENT_MODULE');

    if (CURRENT_MODULE !== name) {
      this.set('MAIN_MODULE', undefined);
      return;
    }

    const MODULES = this.get('MODULES');

    if (MODULES[name]) {
      if (MODULES[name].tag) {
        //The main module has already been added, don't over write it.
        if (MODULES[name].tag === 'main') {
          write = false;
        }
      }

      if (write) {
        //console.log('Writing');
        assign(MODULES[name], o);
      }
    } else {
      if (o._main) {
        MODULES[name] = o;
      }
    }

    this.set('MAIN_MODULE', o);
    return o;
  },

  setCurrentSubmodule (val) {
    if (!val) {
      this.set('CURRENT_SUBMODULE', val);
      return val;
    }

    val = this.trim(val);

    const MODULES = this.get('MODULES');

    if (!MODULES[val]) {
      const mod = MODULES[val] =
        {
          name: val,
          submodules:   {},
          elements:     {},
          classes:      {},
          fors:         {},
          is_submodule: 1,
          namespaces:   {}
        };

      mod.module    = this.get('CURRENT_MODULE');
      mod.namespace = this.get('CURRENT_NAMESPACE');
    }

    this.set('CURRENT_SUBMODULE', val);
    return val;
  },

  setCurrentModule (val) {
    if (!val) {
      this.set('CURRENT_MODULE', val);
      return val;
    }

    val = this.trim(val);

    this.setCurrentSubmodule('');
    this.setCurrentNamespace('');

    const modMain = this.get('MAIN_MODULE');
    if (modMain && modMain.name !== val) {
      this.setMainModule('');
    }

    const CLASSES       = this.get('CLASSES');
    const CURRENT_CLASS = this.get('CURRENT_CLASS');
    const MODULES       = this.get('MODULES');
    const clazz         = CLASSES[CURRENT_CLASS];

    if (clazz) {
      //Handles case where @module comes after @class in a new directory of files
      if (clazz.module !== val) {
        if (MODULES[clazz.module]) {
          delete MODULES[clazz.module].submodules[clazz.submodule];
          delete MODULES[clazz.module].classes[clazz.name];
        }
        if (clazz.submodule && MODULES[clazz.submodule]) {
          delete MODULES[clazz.submodule].submodules[clazz.submodule];
          delete MODULES[clazz.submodule].classes[clazz.name];
        }
        clazz.module = val;
        if (MODULES[val]) {
          MODULES[val].submodules[clazz.submodule] = 1;
          MODULES[val].classes[clazz.name] = 1;
        }
        if (clazz.submodule && MODULES[clazz.submodule]) {
          MODULES[clazz.submodule].module = val;
        }
      }
    }

    if (!(val in MODULES)) {
      MODULES[val] = {
        name:       val,
        submodules: {},
        elements:   {},
        classes:    {},
        fors:       {},
        namespaces: {}
      };
    }

    this.set('CURRENT_MODULE', val);
    return val;
  },

  setCurrentNamespace (val) {
    this.set('lastnamespace', this.get('CURRENT_NAMESPACE'));
    this.set('CURRENT_NAMESPACE', val);
    return val;
  },







  getExtension(path) {
    return A(path.split('.')).get('lastObject');
  },

  implodeString (str) {
    const REGEX_GLOBAL_LINES = this.get('REGEX_GLOBAL_LINES');
    return str.replace(REGEX_GLOBAL_LINES, '!~YUIDOC_LINE~!');
  },

  explodeString (str) {
    return str.replace(/!~YUIDOC_LINE~!/g, '\n');
  },

  trim (s) {
    return s && s.trim ? s.trim() : s;
  },

  unindent (content) {
    const indent = content.match(/^(\s+)/);

    if (indent) {
      content = content.replace(new RegExp(`^${indent[1]}`, 'gm'), '');
    }

    return content;
  },

  _resolveFor (value) {
    if (value.indexOf('.') === -1) {
      const CLASSES = this.get('CLASSES');

      for (let key in CLASSES) {
        if (!CLASSES.hasOwnProperty(key)) {
          continue;
        }

        const i = CLASSES[key];

        if (i.shortname !== value) {
          return;
        }

        if (!i.namespace) {
          return;
        }

        value = i.namespace + '.' + i.shortname;
      }
    }

    return value;
  },





  // http://yui.github.io/yuidoc/api/files/lib_docparser.js.html#l1220
  handleComment ({commentRaw, path, lineNum}) {
    const extension         = this.getExtension(path);
    const IGNORE_TAGS       = this.get('IGNORE_TAGS');
    const REGEX_LINES       = this.get('REGEX_LINES');
    const lineHeadCharRegex = this.get(`REGEX_LINE_HEAD_CHARS.${extension}`);
    const lines             = commentRaw.split(REGEX_LINES);
    const hasLineHeadChar   = lines[0] && lineHeadCharRegex.test(lines[0]);
    const regex             = new RegExp('(?:^|\\n)\\s*((?!@' + IGNORE_TAGS.join(')(?!@') + ')@\\w*)');

    const results =
      [
        {
          tag: 'file',
          value: path
        }, {
          tag: 'line',
          value: lineNum
        }
      ];

    // trim leading line head char(star or harp) if there are any
    if (hasLineHeadChar) {
      for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(lineHeadCharRegex, '');
      }
    }

    // reconstitute and tokenize the comment block
    commentRaw = this.unindent(lines.join('\n'));
    const parts = commentRaw.split(regex);

    for (let i = 0; i < parts.length; i++) {
      let   value = '';
      const part  = parts[i];

      if (part === '') {
        continue;
      }


      let tag;
      let skip = false;

      // the first token may be the description, otherwise it should be a tag
      if (i === 0 && part.substr(0, 1) !== '@') {
        if (part) {
          tag   = '@description';
          value = part;
        } else {
          skip = true;
        }
      } else {
        tag = part;

        // lookahead for the tag value
        const peek = parts[i + 1];
        if (peek) {
          value = peek;
          i++;
        }
      }

      if (!skip && tag) {
        tag = tag.substr(1).toLowerCase();
        results.push({tag, value});
      }
    }

    return results;
  },

  extractComment (file) {
    const path                = file.path;
    const extension           = this.getExtension(path);
    const REGEX_LINES         = this.get('REGEX_LINES');
    const REGEX_START_COMMENT = this.get(`REGEX_START_COMMENTS.${extension}`);
    const REGEX_END_COMMENT   = this.get(`REGEX_END_COMMENTS.${extension}`);
    const code                = file.content;
    const lines               = code.split(REGEX_LINES);
    const len                 = lines.length;
    const comments            = file.comments = [];

    for (let i = 0; i < len; i++) {
      let line = lines[i];

      if (!REGEX_START_COMMENT.test(line)) {
        continue;
      }

      const commentLines = [];
      const lineNum      = i + 1;

      while (i < len && (!REGEX_END_COMMENT.test(line))) {
        commentLines.push(line);
        i++;
        line = lines[i];
      }

      // remove /**
      commentLines.shift();

      const commentRaw = commentLines.join('\n');
      const comment    = this.handleComment({commentRaw, path, lineNum});

      comments.push(comment);
    }

    return file;
  },

  processComment (comment) {
    const SHORT_TAGS  = this.get('SHORT_TAGS');
    const TAGS        = this.get('TAGS');
    const CORRECTIONS = this.get('CORRECTIONS');
    const DIGESTERS   = this.get('DIGESTERS');

    let target = {};
    let host;

    comment.forEach(tag => {
      let name  = this.trim(tag.tag);
      let value = this.trim(tag.value);

      //Convert empty values to a 1 for JSON data parsing later
      if (SHORT_TAGS.contains(name) && value === '') {
        value = 1;
      }

      if (tag && tag.tag) {
        if (!TAGS.contains(name)) {
          if (CORRECTIONS[name]) {
            name = CORRECTIONS[name];
          } else {
            // handle unknown tag
          }
        }

        const digestname = name;
        if (DIGESTERS[digestname]) {
          let digester = DIGESTERS[digestname];
          if (typeof digester === 'string') {
            digester = DIGESTERS[digester];
          }
          const ret = digester.call(this, name, value, target, comment);
          host = host || ret;
        } else {
          target[name] = value;
        }
      }
    });

    if (host) {
      assign(host, target);

      if (host.attributes && target.attributes) {
          host.attributes.push.apply(host.attributes, target.attributes);
      }
    } else if (target.attributes) {
      const ELEMENTS = this.get('ELEMENTS');
      host = ELEMENTS[this.get('CURRENT_ELEMENT')];
      if (host) {
        if (target.deprecated) {
          target.attributes.forEach(function (a) {
            a.deprecated = target.deprecated;

            if (target.deprecationMessage) {
              a.deprecationMessage = target.deprecationMessage;
            }
          });
        }
        host.attributes.push(target.attributes);
      }
    } else {
      const CLASSITEMS = this.get('CLASSITEMS');
      CLASSITEMS.push(target);

      const CURRENT_CLASS  = this.get('CURRENT_CLASS');
      const CURRENT_MODULE = this.get('CURRENT_MODULE');

      target.class  = CURRENT_CLASS;
      target.module = CURRENT_MODULE;

      let host = this.get('CURRENT_SUBMODULE');

      if (host) {
        target.submodule = host;
      }

      host = this.get('CURRENT_NAMESPACE');

      if (host) {
        target.namespace = host;
      }
    }
  },

  processComments (file) {
    this.extractComment(file);

    this.setCurrentFile(file.path);

    file
      .comments
      .forEach(comment => this.processComment(comment));

    return file;
  },

  processModules () {
    const MODULES = this.get('MODULES');
    const FILES   = this.get('FILES');

    for (let name in MODULES) {
      if (!MODULES.hasOwnProperty(name)) {
        continue;
      }

      const module = MODULES[name];

      if (module.file) {
          FILES[module.file].modules[name] = 1;
      }
      if (module.is_submodule) {
          MODULES[module.module].submodules[name] = 1;
      }
      //Clean up processors
      delete module.mainName;
    }
  },

  processClasses () {
    const CLASSES = this.get('CLASSES');
    const MODULES = this.get('MODULES');
    const FILES   = this.get('FILES');

    for (let name in CLASSES) {
      if (!CLASSES.hasOwnProperty(name)) {
        continue;
      }

      const clazz = CLASSES[name];

      if (clazz.module) {
        MODULES[clazz.module].classes[name] = 1;
      }

      if (clazz.submodule) {
        MODULES[clazz.submodule].classes[name] = 1;
        if (!MODULES[clazz.submodule].description) {
          MODULES[clazz.submodule].description = clazz.description;
        }
      }

      if (clazz.file) {
        FILES[clazz.file].classes[name] = 1;
        if (MODULES[clazz.module]) {
            MODULES[clazz.module].file = clazz.file;
            MODULES[clazz.module].line = clazz.line;
        }
        if (MODULES[clazz.submodule]) {
            MODULES[clazz.submodule].file = clazz.file;
            MODULES[clazz.submodule].line = clazz.line;
        }
      }

      if (clazz.uses && clazz.uses.length) {
        clazz.uses.forEach((u) => {
          var c = CLASSES[u];
          if (c) {
            c.extension_for.push(clazz.name);
          }
        });
      }
    }
  },

  processElements () {
    const MODULES = this.get('MODULES');
    const ELEMENTS = this.get('ELEMENTS');

    for (let name in ELEMENTS) {
      if (!ELEMENTS.hasOwnProperty(name)) {
        continue;
      }

      const el = ELEMENTS[name];

      if (el.module) {
        MODULES[el.module].elements[name] = 1;
      }

      if (el.submodule) {
        MODULES[el.submodule].elements[name] = 1;
        if (!MODULES[el.submodule].description) {
          MODULES[el.submodule].description = el.description;
        }
      }
    }
  },

  processClassItems () {
    const CLASSITEMS = this.get('CLASSITEMS');

    CLASSITEMS.forEach(v => {
      if (v.itemtype === 'property' && v.params) {
        v.subprops = v.params;
        v.subprops.forEach(i => {
          //Remove top level prop name from sub props (should have been done in the @param parser
          i.name = i.name.replace(v.name + '.', '');
        });
        delete v.params;
      }
    });
  },

  parse (files) {
    this.setProperties({
      PROJECT:    {},
      FILES:      {},
      MODULES:    {},
      CLASSES:    {},
      ELEMENTS:   {},
      CLASSITEMS: []
    });

    const sortedFiles = A(files).sortBy('path');

    sortedFiles.forEach(file => this.processComments(file));

    this.processModules();
    this.processClasses();
    this.processElements();
    this.processClassItems();

    const data = {
      project:    this.get('PROJECT'),
      files:      this.get('FILES'),
      modules:    this.get('MODULES'),
      classes:    this.get('CLASSES'),
      elements:   this.get('ELEMENTS'),
      classitems: this.get('CLASSITEMS')
    };

    return data;
  },
});
