class Spectator {

  constructor(x = null) {
    if (x) { this.config = x; }
  }

  acceptedConsoleMethods = ['error', 'group', 'info', 'log', 'table', 'trace', 'warn'];
  config = null;
  errorMsg = 'Spectator watch() method contains an invalid config object. Check class instances and individual function calls.'

  // wrapper method that encapsulates a function and provides a user-defined error response handle
  watch(callback, config = this.config) {
    if (!config) { console.error(this.errorMsg); }
    const ce = config.error;
    const cf = config.finally;
    try {
      callback();
    }
    catch (err) {
      if (ce) {
        if (ce.report && this.acceptedConsoleMethods.includes(ce.report)) { console[ce.report](err); }
        //---
        let x;
        if (ce.execute && ce.provideErrArg) {
          ce.execute.arguments[0] = err; //TODO: fix this functionality
          x = ce.execute;
          if (x) { return x; }
        }
        else if (ce.execute) { x = ce.execute; }
        //---
        if (x) { return x; }
        else if (ce.default) { return ce.default; }
      }
    }
    finally {
      if (cf) {
        const x = cf.execute;
        if (x) { return x; }
        else if (cf.default) { return cf.default; }
      }
    }
  }

}

const config = {
  error: {
    default: null, // return this value if callback doesn't return
    execute: null,
    provideErrArg: false, // set to true if you want to receive the err as the first argument in your callback.
    report: null, // 'error', 'info', 'log', 'warn' -- basically any console method that you want to use to display your error
  },
  finally: {
    default: null, // return this value if callback doesn't return
    execute: null, // callback (if value is returned from callback, then same value is returned from finally block)
  }
};