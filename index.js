class Snatcher {

  constructor(x = null) {
    if (x) this.config = x;
  }

  acceptedConsoleMethods = ['error', 'group', 'info', 'log', 'table', 'trace', 'warn'];
  config = null;

  badLogTypeError = 'The logType provided to this Snatcher instance or method config object is not permitted.'
  configError = 'Snatcher instance or method contains an invalid config object.'
  supersedeError = 'The callback provided returns a value but it is superseded by a value returned from the finally block.'

  watch(callback, config = this.config) {
    if (!config) return this._disclose('error', this.configError);
    const ct = config.try;
    const cc = config.catch;
    const cf = config.finally;

    let callbackReturnVal;

    try {
      callbackReturnVal = ct ? this._try(callback, ct) : callback();
      return callbackReturnVal;
    }
    catch (err) {
      if (cc) return this._catch(cc, err)
    }
    finally {
      if (cf) return this._finally(cf)
    }
  }

  _catch (cc) {
    if (cc.logType && this.acceptedConsoleMethods.includes(cc.logType)) { this._disclose(cc.logType, err); }
    else if (cc.logType) { this._disclose('error', this.badLogTypeError) }

    let y;
    if (cc.execute) y = cc.execute();
    if (y) return y;
    if (cc.provideErr) return err;
    if (cc.default) return cc.default;
  }

  _disclose (logType, msg) {
    if (config.silence) return;
    console[logType](msg);
  }

  _finally (cf) {
    let x;
    if (cf.execute) x = cf.execute();
    if (x || cf.default && callbackReturnVal) this._disclose('warn', this.supersedeError)
    if (x) return x;
    if (cf.default) return cf.default;
  }

  _try (callback, ct) {
    let x;
    x = callback();
    if (x) return x;
    if (ct.execute) x = ct.execute();
    if (x) return x;
    if (ct.default) return ct.default;
  }

}