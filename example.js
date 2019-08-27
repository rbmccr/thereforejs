import Spectator from './main';

let s = new Spectator();

let config = {
  error: null,
  finally: null
};

// -----------------------------

new Spectator().watch(myfn, config);

function myfn(a) {
  if (a) { return 'x'; }
  return 'b';
}

console.log(new Spectator().watch(function z() { return 10; }, config))