

Class tags
----------

### @ember <type>

Inidcates which part of an Ember app the class belongs to.

Common values:

* adapter
* authenticator
* authorizer
* component
* controller
* helper
* initializer
* instance-initializer
* macro
* mixin
* model
* route
* serializer
* service
* session-store
* util

Custom values are allowed.



Property tags
-------------

### @argument

Indicates that this property is expected to be set from the outside. Useful for Ember components.


### @computed [dependency1] [dependency2]

Indicates a computed property.

You should list property names on which given property depends.

For computed properties that don't have a setter you should also use `@final`.


### @volatile

Indicates a computed property that recomputes every time it's read.



Method tags
-----------

### @action

Indicates an Ember action.


### @observer [dependency]

Indicates a method that executes automatically when the named computed property updates.


### @on [event]

Indicates a method that executes automatically when the named event triggers.



