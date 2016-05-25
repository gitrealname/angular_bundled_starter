/*eslint import/no-mutable-exports: 0*/
import prodCfg from './config.production.json';
import devCfg from './config.development.json';

let exp = prodCfg;

if (process.env.ENV === process.env.CONST_ENV_DEV) {
  exp = devCfg;
}

export default exp;
