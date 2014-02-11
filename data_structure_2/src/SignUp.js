/**
 * Created by xiaofen on 14-2-11.
 */

function SignUp(name, phone) {
    this.name = name;
    this.phone = phone;
}
SignUp.render_sign_ups = function (activity_name) {
    var activities = JSON.parse(localStorage.activities);
    var activity= _.find(activities,function(activity){
        return activity.name==activity_name;
    });
    return activity.sign_ups;
}