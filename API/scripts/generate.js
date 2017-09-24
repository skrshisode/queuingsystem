'use strict';

/**
 * Dependencies
 */
const fs = require('fs');
const glob = require('glob-all');
const YAML = require('yaml-js');
const extendify = require('extendify');

const patterns = [
  'api/spec/src/*.y*ml',
  'api/spec/*.y*ml',
];

glob(patterns, (er, files) => {
  const contents = files.map(f => {
    return YAML.load(fs.readFileSync(f).toString());
  });
  const extend = extendify({
    inPlace: false,
    isDeep: true,
  });
  const merged = contents.reduce(extend);
  fs.writeFile('api/swagger/swagger.yaml',
    YAML.dump(merged), (err) => {
      if (err) {
        throw err;
      }
      console.log('Created - %s', 'swagger.yaml!');
    });
  fs.writeFile('api/swagger/swagger.json',
    JSON.stringify(merged, null, 2), (err) => {
      if (err) {
        throw err;
      }
      console.log('Created - %s', 'swagger.json!');
    });
});
