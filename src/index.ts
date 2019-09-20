interface Try {
  default: any,
  execute: Function,
}

interface Catch {
  default: any,
  execute: Function,
  provideErr: boolean,
  report: string
}

interface Config {
  try?: Try
  catch?: Catch
  finally?: Finally
}

interface Finally {
  default: any,
  execute: Function,
}

class Snatcher {

  constructor(x?: Config) {
    this.config = x ? x : null;
  }

  private acceptedConsoleMethods: string[] = ['error', 'group', 'info', 'log', 'table', 'trace', 'warn'];
  private config: Config;
  private errorMsg: string = 'Snatcher method contains an invalid config object. Check class instances and individual function calls.'

  watch(callback: Function, config: Config = this.config) {
    if (!config) { return console.error(this.errorMsg); }
    const ct = config.try;
    const cc = config.catch;
    const cf = config.finally;
    try {
      let x;
      x = callback();
      if (x) { return x; }
      else if (ct) {
        if (ct.execute) { x = ct.execute(); }
        if (x) { return x; }
        else if (ct.default) { return ct.default; }
      }
    }
    catch (err) {
      if (cc) {
        if (cc.report && this.acceptedConsoleMethods.includes(cc.report)) { console[cc.report](err); }
        if (cc.execute) {
          const y = cc.execute();
          if (y) { return y; }
        }
        if (cc.provideErr) { return err; }
        else if (cc.default) { return cc.default; }
      }
    }
    finally {
      if (cf) {
        let z;
        if (cf.execute) { z = cf.execute(); }
        if (z) { return z; }
        else if (cf.default) { return cf.default; }
      }
    }
  }

}

export default Snatcher;