import Ember from 'ember';

const {
  A,
  Component,
  computed
} = Ember;

import layout from '../templates/components/me-nu';

import _ from 'npm:lodash';

export default Component.extend({

  // ----- Arguments -----
  versionRecord: null,


  // ----- Overridden properties -----
  layout,
  classNames: ['meNu'],



  // ----- Overwritable properties -----
  filter: '',



  // ----- Computed properties -----
  modulesFiltered: computed('versionRecord.modulesSorted', 'filter', function() {

    const filter  = this.get('filter');
    const modules = this.get('versionRecord.modulesSorted');

    if (!filter || !filter.length) {
      return modules;
    }

    return modules.filter(m =>
      m.get('name') && m.get('name').indexOf(filter) > -1
    );
  }),

  namespacesFiltered: computed('versionRecord.namespacesSorted', 'filter', function() {

    const filter  = this.get('filter');
    const namespaces = this.get('versionRecord.namespacesSorted');

    if (!filter || !filter.length) {
      return namespaces;
    }

    return namespaces.filter(n =>
      n.get('name') && n.get('name').indexOf(filter) > -1
    );
  }),

  classesFiltered: computed('versionRecord.classesSorted', 'filter', function() {

    const filter  = this.get('filter');
    const classes = this.get('versionRecord.classesSorted');

    if (!filter || !filter.length) {
      return classes;
    }

    return classes.filter(c =>
      c.get('name') && c.get('name').indexOf(filter) > -1
    );
  }),

  groupedPages: computed('versionRecord.pages.@each.{group,title}', function () {
    const pages =
      this
        .get('versionRecord.pages')
        .filterBy('title')
        .toArray();

    return _(pages)
      .groupBy(page => page.get('group'))
      .map((pages, group) => ({
        group,
        pages: A(pages).sortBy('position', 'title').toArray()
      }))
      .sortBy(({group}) => (
        group === 'default'   ? '' :
        group === 'undefined' ? 'Ј' :
                                group
      ))
      .value();
  }),


  // ----- Actions -----
  actions: {
    clearFilter () {
      this.set('filter', '');
    }
  }


});
