#! /usr/bin/env node

// ---------------------------------------------------------------------------
// Demonstrates some common scheduling frequency and recurrence patterns.
// ---------------------------------------------------------------------------

var Scheduler = require('../lib/nschedule');

// Create a scheduler that will not execute more than 2 tasks
// at a time.
var scheduler = new Scheduler(2);

// This task recurs every 3 seconds.
scheduler.add(3000, function(done){
    console.log("Task at period  3s. " + (new Date).toISOString());
    done();
});

// This task recurs every 5 seconds.
scheduler.add(5000, function(done){
    console.log("Task at period  5s. " + (new Date).toISOString());
    done();
});

// This task executes once after 15 seconds.
scheduler.add(15000, function(done){
    console.log("Task at period 15s. " + (new Date).toISOString());
    done(scheduler.STOP);
});

// This task executes immediately and does not recur.
// The interval is effectively ignored.
scheduler.add(1000, function(done){
        console.log("One shot task.      " + (new Date).toISOString());

        // Stop after first and only execution.
        done(scheduler.STOP);
    },
    scheduler.IMMEDIATE);
