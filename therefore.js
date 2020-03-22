class IAm {

  constructor(x = {}) {
    this.config = x;
  }

  acceptedConfigKeys = ['try', 'catch', 'finally', 'silence']
  acceptedConsoleMethods = ['error', 'group', 'info', 'log', 'table', 'trace', 'warn'];

  // console outputs
  badLogTypeError = '[IAm] The logType provided is not permitted.'
  configError = '[IAm] Invalid config object.'
  supersedeError = '[IAm] Callback provided returns a truthy value but it is superseded by a value returned from the finally block.'

  watching(callback, config = this.config) {
    if (!this._configIsValid(config)) return this._disclose(config, 'error', this.configError);
    const ct = config.try;
    const cc = config.catch;
    const cf = config.finally;

    let callbackReturnVal;

    try {
      callbackReturnVal = ct ? this._try(config, callback) : callback();
      return callbackReturnVal;
    }
    catch (err) {
      if (cc) return this._catch(config, err);
    }
    finally {
      if (cf) return this._finally(config, callbackReturnVal);
    }
  }

  _catch (config, err) {
    const cc = config.catch;

    if (cc.logType && this.acceptedConsoleMethods.includes(cc.logType)) { this._disclose(config, cc.logType, err); }
    else if (cc.logType) { this._disclose(config, 'error', this.badLogTypeError); }

    let x;
    if (cc.execute) x = cc.execute();
    if (x) return x;
    if (cc.provideErr) return err;
    return cc.default;
  }

  // check for misspelled or illegal keys OR for an improper argument type
  _configIsValid (config) {
    return this._isObject(config) && !Object.keys(config).some(val => !this.acceptedConfigKeys.includes(val));
  }

  _disclose (config, logType, msg) {
    if (config.silence) return;
    console[logType](msg);
  }

  _finally (config, callbackReturnVal) {
    const cf = config.finally;

    let x;
    if (cf.execute) x = cf.execute();
    if (x || cf.default && callbackReturnVal) this._disclose(config, 'warn', this.supersedeError);
    if (x) return x;
    return cf.default;
  }

  _isObject (obj) {
    return !!obj && obj === Object(obj) && obj.constructor !== Array;
  }

  _try (config, callback) {
    const ct = config.try;

    let x;
    x = callback();
    if (x) return x;
    if (ct.execute) x = ct.execute();
    if (x) return x;
    return ct.default;
  }

}

export default IAm;
