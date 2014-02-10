/**
 * Created by xiaofen on 14-2-10.
 */
function Activity(name, sign_ups, bids) {
    this.name = name;
    this.sign_ups = sign_ups;
    this.bids = bids;
}
Activity.save_activity_to_activities = function (activity) {
    var activities = JSON.parse(localStorage.getItem('activities')) ;
    activities.unshift(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
}
Activity.save_activity_name_to_current_activity = function(activity_name){
    localStorage.setItem('current_activity',activity_name);
}