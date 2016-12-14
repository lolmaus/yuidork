# Yuidork

View YUIDoc (and probably JSDoc) documentation generated realtime from any GitHub sources.

Allows viewing docs for *any* branch/tag/commit, does not require generated docs to be uploaded.

**Work in progress! See the roadmap below.**

## Live demos:

* [emberjs/ember.js](http://http://lolmaus.github.io//yuidork/#/emberjs/ember.js/master)
* [emberjs/data](http://http://lolmaus.github.io//yuidork/#/emberjs/data/master)
* [simplabs/ember-simple-auth](http://http://lolmaus.github.io//yuidork/#/simplabs/ember-simple-auth/master)
* [cibernox/ember-cpm](http://http://lolmaus.github.io//yuidork/#/cibernox/ember-cpm/master)
* [yui/yuidoc](http://http://lolmaus.github.io//yuidork/#/yui/yuidoc/master)


## Roadmap

> #### Legend
>
> :white_circle: -- not implemented yet, planned  
> :radio_button: -- in progress (leaf) or partially implemented (branch)  
> :black_circle: -- implemented   
> :no_entry:     -- blocked, has to be figured out  

* :radio_button: Parsing
  * :radio_button: Models and relationships
    * :black_circle: Version (git tag/branch/commit/etc)
    * :black_circle: File
    * :black_circle: Module
    * :black_circle: Class
    * :black_circle: Class Item
    * :black_circle: Namespace
    * :no_entry: Project (need a better way to present project info)
    * :no_entry: Element (don't know what that is, need a reference project)
    * :no_entry: For     (don't know what that is, need a reference project)
  * :black_circle: Parse YUIDoc JSON format and populate store 
  * :black_circle: Generate documentation live for any project on GitHub
    * :black_circle: Port YUIDoc.DocParser (aww yiss! :sunglasses:)
    * :black_circle: Custom AJAX service
    * :black_circle: Loading screen with stages display
  * :white_circle: Display documentation from existing JSON files
* :radio_button: UI
  * :black_circle: Menu
  * :black_circle: Module page
  * :white_circle: Namespace page
  * :radio_button: Class page
    * :radio_button: Basic class info
    * :black_circle: Class Items component (navigate/filter class items)
    * :white_circle: Class Item component (method/property/event)
  * :white_circle: Reload model when changing URL params
  * :white_circle: Versions switcher
  * :white_circle: Project switcher
  * :white_circle: Search options
  * :black_circle: Linking to viewed project on GitHub
  * :white_circle: Linking to viewed project's website (from config)
* :radio_button: Configuration
  * :radio_button: Source
    * :black_circle: Via query params
    * :white_circle: Via dotfile
  * :white_circle: Options
    * :black_circle: Versions
    * :white_circle: Extensions
    * :white_circle: Path to JSDoc's `data.json`
    * :white_circle: Project info: name, desc, URL
    * :white_circle: Disable/enable project switcher
    * :white_circle: Hide menu sections
* :white_circle: Styling
* :white_circle: Authentication
  * :white_circle: GitHub auth
    * :white_circle: Viewing private repos
  * :white_circle: Error handling
    * :white_circle: API limit
    * :white_circle: Network failure
* :radio_button: Advanced features
  * :black_circle: Caching
    * :black_circle: Basic caching
    * :black_circle: Background SHA fetching and comparing
  * :radio_button: Parsing docs from file system
    * :black_circle: Figure out how to serve and access files on disk
    * :black_circle: Implement
    * :white_circle: Document
    * :no_entry: Live-reloading (would be a fantastic to have, but too tricky to implement)
  * :white_circle: Cross-linking
* :white_circle: Some tests maybe
* :white_circle: Document with YUIDoc :trollface:
* :no_entry: Support JSDoc (need to figure out how different YUIDoc and JSDoc formats are)



## Project structure

Yuidork is distributed as an Ember addon, you can use it to build your own app or to include documentation into an existing Ember app.

But the Yuidork addon also bundles a dummy app which aims to be a universal and fully functional YUIDoc@GitHub viewer.



## License

This software is free to use under the MIT license. See the [LICENSE](https://github.com/lolmaus/yuidork/blob/gen-1/LICENSE.md) file for license text and copyright information.

Includes code ported from [YUIDoc](https://github.com/yui/yuidoc) ([Yahoo Inc. BSD license](https://github.com/yui/yuidoc/blob/master/LICENSE)).

This software tries to adhere to the [YUIDoc format](http://yui.github.io/yuidoc/syntax/index.html), but it's not endorsed by or affiliated with Yahoo or YUIDoc.

The dummy app uses [Fugue icons](http://p.yusukekamiyamane.com/index.html.en) by [Yusuke Kamiyamane](http://p.yusukekamiyamane.com/about/) ([Creative Commons
Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/legalcode)).
