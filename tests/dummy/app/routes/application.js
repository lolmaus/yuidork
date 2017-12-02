import Ember from 'ember';

const {
  $,
  on,
  Route
} = Ember;

/**
 * @class ApplicationRoute
 * @extends Ember.Route
 * @ember route
 **/

export default Route.extend({

  // // ----- Events -----
  // /**
  //  * @method overrideLinkClick
  //  * @event 'init'
  //  **/
  // overrideLinkClick: on('init', function () {
  //   $(document)
  //     .on('click', 'a', (e) => {
  //       if (e.ctrlKey || e.metaKey || e.target.target === '_blank') {
  //         return;
  //       }
  //
  //       let target = e.target || e.currentTarget;
  //
  //       if (target.host !== window.location.host || target.hash) {
  //         return;
  //       }
  //
  //       e.preventDefault();
  //
  //       const $target = $(target);
  //
  //       const type = $target.data('type') || 'page';
  //       const route = `version.${type}`;
  //       const id    = $target.attr('href');
  //
  //       this.transitionTo(route, id);
  //
  //       // if (target.pathname === '/') {
  //       //   this.transitionTo('index');
  //       // } else {
  //       //   this.transitionTo('page', target.pathname.replace(/^\//, ''));
  //       // }
  //     });
  // })
});
