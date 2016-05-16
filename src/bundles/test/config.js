/*eslint import/no-mutable-exports: 0*/
import prodCfg from './config.production.json';
import devCfg from './config.development.json';

let exp = prodCfg;

if (process.env.ENV === 'development') {
  exp = devCfg;
}

export default exp;
