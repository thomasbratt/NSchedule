// ----------------------------------------------------------------------------
// Represents a task that can be executed periodically.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Exposed functionality.
// ----------------------------------------------------------------------------
module.exports = Task;

// ----------------------------------------------------------------------------
// Constructs a new Task object.
//
//  inverval    : The interval, in milliseconds, after which a task is
//                rescheduled. Note that a task is only rescheduled when it
//                completes, to prevent overlap.
//  action      : The function to call after the interval.
// ----------------------------------------------------------------------------
function Task(interval, action){
    this._interval = interval;
    this._action = action;
}

Task.prototype._activeAt = 0;

Task.prototype.dispatch = function(callback){
    this._action(callback);
}

Task.prototype.schedule = function(){
    this._activeAt = Date.now() + this._interval;
}

Task.prototype.waitRemaining = function(){
    var result = this._activeAt - Date.now();
    if(result < 0){
        return 0;
    } else {
        return result;
    }
}

