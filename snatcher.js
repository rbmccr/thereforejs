class Snatcher {

  constructor(x = null) {
    if (x) this.config = x;
  }

  acceptedConfigKeys = ['try', 'catch', 'finally', 'silence']
  acceptedConsoleMethods = ['error', 'group', 'info', 'log', 'table', 'trace', 'warn'];
  config = {};

  // console outputs
  badLogTypeError = '[Snatcher] The logType provided is not permitted.'
  configError = '[Snatcher] Invalid config object.'
  supersedeError = '[Snatcher] Function provided returns a truthy value but it is superseded by a value returned from the finally block.'

  watch(callback, config = this.config) {
    if (!this._configIsValid(config)) return this._disclose('error', this.configError);
    const ct = config.try;
    const cc = config.catch;
    const cf = config.finally;

    let callbackReturnVal;

    try {
      callbackReturnVal = ct ? this._try(callback, ct) : callback();
      return callbackReturnVal;
    }
    catch (err) {
      if (cc) return this._catch(cc, err);
    }
    finally {
      if (cf) return this._finally(cf);
    }
  }

  _catch (cc) {
    if (cc.logType && this.acceptedConsoleMethods.includes(cc.logType)) { this._disclose(cc.logType, err); }
    else if (cc.logType) { this._disclose('error', this.badLogTypeError); }

    let x;
    if (cc.execute) x = cc.execute();
    if (x) return x;
    if (cc.provideErr) return err;
    return cc.default;
  }

  // check for misspelled or illegal keys OR for an improper argument type
  _configIsValid (config) {
    return this._isObject(config) && !Object.keys(config).some(val => this.acceptedConfigKeys.indexOf(val) === -1)
  }

  _disclose (logType, msg) {
    if (config.silence) return;
    console[logType](msg);
  }

  _finally (cf) {
    let x;
    if (cf.execute) x = cf.execute();
    if (x || cf.default && callbackReturnVal) this._disclose('warn', this.supersedeError);
    if (x) return x;
    return cf.default;
  }

  _isObject (obj) {
    return !!obj && obj === Object(obj) && !(obj.constructor === Array)
  }

  _try (callback, ct) {
    let x;
    x = callback();
    if (x) return x;
    if (ct.execute) x = ct.execute();
    if (x) return x;
    return ct.default;
  }

}