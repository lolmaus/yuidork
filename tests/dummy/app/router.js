import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('version', {path: '/:owner/:repo/:version'}, function() {
    this.route('module',    {path: 'modules/:moduleId'});
    this.route('namespace', {path: 'namespaces/:namespaceId'});
    this.route('class',     {path: 'classes/:classId'});
    this.route('page',      {path: 'pages/:pageId'});
  });
  this.route('loading');
});

export default Router;
