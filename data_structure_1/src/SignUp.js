/**
 * Created by xiaofen on 14-2-10.
 */

function SignUp(name, phone) {
    this.name = name;
    this.phone = phone;
}
SignUp.get_sign_ups_by_activity_name = function (activity_name) {
    var activities = Activity.get_activities();
    var activity = _.find(activities, function (activity) {
        return activity.name == activity_name;
    });
    return activity.sign_ups;
}