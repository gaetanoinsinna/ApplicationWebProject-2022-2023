"use strict";

const sqlite = require('sqlite3');

exports.db = new sqlite.Database("booking.sqlite", (err) => {
    if (err) throw err;
  });

