/**
 * Created by xiaofen on 14-2-12.
 */
function Activity(name) {
    this.id = '';
    this.name = name;
}

Activity.prototype.create = function () {
    this.id = Activity.activity_id();
    var activities = Activity.get_activities();
    activities.push(this);
    Activity.save_activities(activities);
    localStorage.activity_id_generator = Activity.activity_id();
    localStorage.current_activity = this.id;
}

Activity.activity_id = function () {
    var activities = JSON.parse(localStorage.activities);
    return activities.length.toString();
}

Activity.get_activities = function () {
    return JSON.parse(localStorage.activities);
}

Activity.save_activities = function (activity) {
    localStorage.activities = JSON.stringify(activity);
}