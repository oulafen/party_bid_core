/**
 * Created by xiaofen on 14-2-11.
 */
function Activity(name) {
    this.name = name;
    this.sign_ups = [];
    this.bids = [];
    this.biddings = {};

}
Activity.prototype.create = function () {
    var activities = JSON.parse(localStorage.getItem('activities'));
    var new_id = Activity.get_activity_id_generator();
    activities[new_id] = this;
    Activity.save_new_activity_id(new_id);
    localStorage.activity_id_generator=JSON.stringify(new_id+1);
    localStorage.activities = JSON.stringify(activities);
    localStorage.current_activity= JSON.stringify(new_id);
}
Activity.get_activity_id_generator = function () {
    var activity_ids = JSON.parse(localStorage.activity_ids);
    return activity_ids.length;
}
Activity.get_new_activity_id = function () {

}
Activity.save_new_activity_id = function (new_id) {
    var activity_ids = JSON.parse(localStorage.getItem('activity_ids'));
//    var string_id=
    activity_ids.push(new_id.toString()) ;
    localStorage.setItem('activity_ids',JSON.stringify(activity_ids));
}
Activity.get_activities=function(){
    return JSON.parse(localStorage.activities);
}


