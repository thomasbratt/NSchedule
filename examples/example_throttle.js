#! /usr/bin/env node

// ---------------------------------------------------------------------------
// Demonstrates the limit on concurrently executing tasks.
// ---------------------------------------------------------------------------

var Scheduler = require('../lib/nschedule');

var TICK_IN_MS = 100;

// Create a scheduler that will not execute more than 1 task
// at a time.
//
// Change the concurrency parameter to 2 to allow the first task to execute
// when the second is running.
var scheduler = new Scheduler(1);

// This task recurs every second but will be blocked for executing by the long
// running task schedule every 5s.
scheduler.add(1000, function(done){
    logWithTimestamp('Task at 1s  *');
    done();
});

// This task is scheduled to recur every 5s but also takes 5s to execute, so it
// will actually execute every 10s.
//
// As the scheduler was created with a concurrency setting of 1, when this task
// executes it will block the task that runs every 1s while it is executing.
// To prevent this behavior, create the scheduler with a higher concurrency
// setting.
scheduler.add(5000, function(done){
    logWithTimestamp('Task at 10s  ********** (start)');
    busy('Task at 10s  ********** (end)', 5000, done);
});

// Simulate some operation that takes time to complete (backing up a database or
// network communications, for exanple).
function busy(name, interval, done){
    if(interval <= 0){
        logWithTimestamp(name);
        done();
        return;
    }

    setTimeout(function(){
        busy(name, interval - TICK_IN_MS, done);
    }, TICK_IN_MS);
}

function logWithTimestamp(name){
    console.log((new Date).toISOString() + " " + name);   
}