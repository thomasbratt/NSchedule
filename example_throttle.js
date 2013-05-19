#! /usr/bin/env node

// ---------------------------------------------------------------------------
// Demonstrates the limit on concurrently executing tasks.
// ---------------------------------------------------------------------------

var Scheduler = require('./nschedule');

var TASK_DURATION = 900;
var TICK_IN_MS = 300;

// Create a scheduler that will not execute more than 1 task
// at a time.
var scheduler = new Scheduler();

// This task recurs every 1 seconds.
scheduler.add(1000, function(done){
    busy("Task 1  *", TASK_DURATION, done);
});

// This task recurs every 2 seconds.
scheduler.add(2000, function(done){
    busy("Task 2  **", TASK_DURATION, done);
});

// This task recurs every 5 seconds.
scheduler.add(5000, function(done){
    busy("Task 3  ***", TASK_DURATION, done);
});

// Simulate some operation that takes time to complete (backing up a database or
// network communications, for exanple).
function busy(name, interval, done){
    if(interval <= 0){
        done();
        return;
    }

    setTimeout(function(){
            console.log((new Date).toISOString() + " " + name);
            busy(name, interval - TICK_IN_MS, done);
        }, TICK_IN_MS);
}
