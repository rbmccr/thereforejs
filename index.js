class Snatcher {

  constructor(x = null) {
    if (x) { this.config = x; }
  }

  acceptedConsoleMethods = ['error', 'group', 'info', 'log', 'table', 'trace', 'warn'];
  config = null;
  errorMsg = 'Snatcher watch() method contains an invalid config object. Check class instances and individual function calls.'

  watch(callback, config = this.config) {
    if (!config) { return console.error(this.errorMsg); }
    const ce = config.error;
    const cf = config.finally;
    try {
      callback();
    }
    catch (err) {
      if (ce) {
        if (ce.report && this.acceptedConsoleMethods.includes(ce.report)) { console[ce.report](err); }
        //---
        else if (ce.execute) {
          const x = ce.execute();
          if (x) { return x; }
        }
        if (ce.provideErr) { return err; }
        else if (ce.default) { return ce.default; }
      }
    }
    finally {
      if (cf) {
        let x;
        if (cf.execute) { x = cf.execute(); }
        if (x) { return x; }
        else if (cf.default) { return cf.default; }
      }
    }
  }

}