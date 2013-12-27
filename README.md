NSchedule
=========

An efficient periodic task scheduler with concurrency limits.

Features
--------

* Limits the nunmber of concurrently executing tasks. This avoids overloading
  the resource used by the task (a server or network link, for example).
* Efficiently schedules tasks that must be repeated periodically.
* Individual tasks are rescheduled _after_ they have run. This prevents multiple
  invocations of the same task from overlapping.
* Allows any combination of: immediate/delayed and periodic/one-shot.

Related Packages
----------------

Some other packages you might want to consider.
* [agenda]((https://npmjs.org/package/agenda)
  Database-backed cron-like scheduler.
* [flagpoll](https://npmjs.org/package/flagpoll)
  Supports a finite number of task executions (will not reschedule a task
  indefinitely).
* [node-schedule](https://npmjs.org/package/node-schedule)
  Cron-like scheduling. From the readme: 'node-schedule is for time-based
  scheduling, not interval-based scheduling.'
* [poll](https://npmjs.org/package/poll)
  Work in progress.
* [pomelo-schedule](https://npmjs.org/package/pomelo-schedule)
  Allows cron syntax. No concurrency limits. For example, schedule 100 tasks
  with different intervals in the same section of code and all 100 will trigger
  immediately.
* [simple-schedule](https://npmjs.org/package/simple-schedule)
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

    var Scheduler = require('nschedule');

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

    var Scheduler = require('nschedule');

    var TICK_IN_MS = 100;

    // Create a scheduler that will not execute more than 1 task
    // at a time.
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

````


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/thomasbratt/nschedule/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

