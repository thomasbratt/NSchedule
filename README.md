NSchedule
=========

An efficient periodic task scheduler with concurrency limits.

Features
--------

* Limits the nunmber of concurrently executing tasks. This avoids overloading
  the resource used by the task (a server or network link, for example).
* Efficiently schedules tasks that must be repeated periodically.
* Tasks are rescheduled _after_ they have run. This prevents multiple
  invocations of the same task overlapping.
* Allows any combination of: immediate/delayed and periodic/one-shot.

Related Packages
----------------

Some other packages you might want to consider.

* [flagpoll](https://npmjs.org/package/flagpoll):
  Supports a finite number of task executions (will not reschedule a task
  indefinitely).
* [poll](https://npmjs.org/package/poll):
  Work in progress.
* [pomelo-schedule](https://npmjs.org/package/pomelo-schedule):
  Allows cron syntax. No concurrency limits. For example, schedule 100 tasks
  with different intervals in the same section of code and all 100 will trigger
  immediately.
* [simple-schedule](https://npmjs.org/package/simple-schedule):
  All tasks must have the same interval and do not recur.

Installation
------------

> npm install nschedule

Common Usage
------------

````JavaScript

    #! /usr/bin/env node

    // ---------------------------------------------------------------------------
    // Demonstrates some common scheduling frequency and recurrence patterns.
    // ---------------------------------------------------------------------------

    var Scheduler = require('./nschedule');

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

````

Concurrency Limiting Example
----------------------------

````JavaScript

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

````
