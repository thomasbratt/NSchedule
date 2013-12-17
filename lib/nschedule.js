// ----------------------------------------------------------------------------
// A periodic task scheduler with concurrency limits.
// ----------------------------------------------------------------------------
var PriorityQueue = require('priorityqueuejs');
var Task = require('./task.js');

// ----------------------------------------------------------------------------
// Exposed functionality.
// ----------------------------------------------------------------------------
module.exports = Scheduler;

// ----------------------------------------------------------------------------
// Constants.
// ----------------------------------------------------------------------------
Scheduler.prototype.IMMEDIATE = "IMMEDIATE";
Scheduler.prototype.STOP = "STOP";
Scheduler.prototype._TIMER_TOLERANCE_IN_MS = 10;

// ----------------------------------------------------------------------------
// State .
// ----------------------------------------------------------------------------
Scheduler.prototype._timerID = null;

// ----------------------------------------------------------------------------
// Constructs a new Scheduler object.
//
//  concurrency:    The number of tasks that can execute concurrently.
// ----------------------------------------------------------------------------
function Scheduler(concurrency){
    this._active = [];
    this._concurrency = concurrency || 1;
    this._pending = new PriorityQueue(function(a, b) {
            return b.waitRemaining() - a.waitRemaining();
        });    
}

// ----------------------------------------------------------------------------
// Add a new task with a specified interval between executions and an action to
// execute.
//
//  inverval    : The interval, in milliseconds, after which a task is
//                rescheduled. Note that a task is only rescheduled when it
//                completes, to prevent overlap.
//  action      : The function to call after the interval.
//  behavior    : Set to 'IMMEDIATE' to start execution without waiting for the
//                first interval to pass (optional, waits by default).
// ----------------------------------------------------------------------------
Scheduler.prototype.add = function(interval, action, behavior){
    // Update the queue of tasks.
    // Tasks are ordered by when they next need to execute.
    var task = new Task(interval, action);

    if(behavior !== this.IMMEDIATE){
        task.schedule();
    }
    this._pending.enq(task);

    // Recompute the task schedule.
    this._recompute();
}

Scheduler.prototype._recompute = function(){
    // Do nothing if there are no tasks.
    if(this._pending.isEmpty()){
        console.log("No more tasks.");
        return;
    }

    // Schedule the next due task.
    var task = this._pending.peek();
    var wait = task.waitRemaining();
        
    this._schedule(wait);
}

Scheduler.prototype._schedule = function(wait){
    // Clear previous timer.
    if(this._timerID){
        clearTimeout(this._timerID);
    }

    // Schedule execution of the first item on the queue.
    var self = this;
    this._timerID = setTimeout(function(){
            self._dispatch();
        }, wait);
}

Scheduler.prototype._dispatch = function(){
    if(this._active.length >= this._concurrency){
        return;
    }

    var task = this._pending.peek();
    if(task.waitRemaining() <= this._TIMER_TOLERANCE_IN_MS){
        this._pending.deq();
        this._active.push(task);
        var self = this;
        task.dispatch(function(behavior){
            self._onComplete(task, behavior);
            self._recompute();
        });
    }
    this._recompute();
}

// When a task has finished, remove from the active set and reschedule
// for its next execution.
Scheduler.prototype._onComplete = function(task, behavior){
    var i = this._active.indexOf(task);
    if(i !== -1){
        this._active.splice(i, 1);
    }

    if(behavior !== this.STOP){
        task.schedule();
        this._pending.enq(task);
    }
}
