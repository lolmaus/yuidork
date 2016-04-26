import Ember from 'ember';

const {
  A,
  computed: {alias},
  Object: EObject,
  RSVP: {defer},
  run: {later}
} = Ember;

const O = EObject.create.bind(EObject);


// Stage structure:
//   {
//     name:     'Filling pools',
//     complete: false,
//     total:    100,
//     current:  23
//   }

export default EObject.extend({

  // ----- Static properties -----
  stages: A(),



  // ----- Computed properties -----
  currentStage: alias('stages.lastObject'),



  // ----- Next stage -----
  next (name, callback) {
    const currentStage = O({name, complete: false});
    const stages       = this.get('stages');

    stages.addObject(currentStage);

    return this
      ._runLaterWithPromise(currentStage, callback)
      .then(result => (this.completeLastStage(), result));
  },

  completeLastStage () {
    const previousStage = this.get('currentStage');

    if (previousStage) {
      previousStage.set('complete', true);
    }
  },

  _runLaterWithPromise (currentStage, callback) {

    console.log({currentStage})
    const deferred = defer();

    later(() => {
      const result = callback(currentStage);
      deferred.resolve(result);
    });

    return deferred.promise;
  }
});
