/**
 * Created by xiaofen on 14-2-10.
 */
function Activity(name, sign_ups, bids) {
    this.name = name;
    this.sign_ups = sign_ups;
    this.bids = bids;
}
Activity.save_activity_to_activities = function (activity) {
    var activities = JSON.parse(localStorage.getItem('activities'));
    activities.unshift(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
}
Activity.save_activity_name_to_current_activity = function (activity_name) {
    localStorage.setItem('current_activity', activity_name);
}
Activity.get_current_activity = function () {
    var activities = JSON.parse(localStorage.getItem('activities'));
    var name = localStorage.getItem('current_activity');
    return _.find(activities, function (activity) {
        return activity.name == name;
    });
}
Activity.get_activities = function () {
    return JSON.parse(localStorage.activities);
}