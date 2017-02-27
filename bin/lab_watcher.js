#!/usr/bin/env node

var fs = require('fs');

/**
 * Module dependencies.
 */

console.log("Watching files?");

fs.watch('./tmp', {encoding: 'buffer'}, (eventType, filename) => {
  if (filename)
    console.log(filename);
    // Prints: <Buffer ...>
});
