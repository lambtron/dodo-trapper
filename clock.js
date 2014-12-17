
/**
 * Module dependencies.
 */

var trapper = require('./tasks/trapper.js');
var CronJob = require('cron').CronJob;

/**
 * Initiate monthly Cronjob.
 * Job will every day at 12:00am.
 */

new CronJob({
  cronTime: "0 0 1 * *",
  onTick: trapper(),
  start: true,
  timeZone: "America/Los_Angeles"
});
