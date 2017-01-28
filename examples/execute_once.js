#! /usr/bin/env node

// ---------------------------------------------------------------------------
// Demonstrates a task that executes once after a fixed period of time.
// ---------------------------------------------------------------------------

var Scheduler = require('../lib/nschedule');

// Create a scheduler that will not execute more than 2 tasks
// at a time.
var scheduler = new Scheduler(2);

// This task executes immediately and does not recur.
// The interval is effectively ignored.
scheduler.add(1000, function(done){
        console.log("One shot task.      " + (new Date).toISOString());

        // Stop after first and only execution.
        done(scheduler.STOP);
    },
    scheduler.IMMEDIATE);
