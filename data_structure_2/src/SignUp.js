/**
 * Created by xiaofen on 14-2-11.
 */
function SignUp(name, phone) {
    this.name = name;
    this.phone = phone;
}
SignUp.render_sign_ups = function (activity_name) {
    var activities = JSON.parse(localStorage.activities);
    var activity = _.find(activities, function (activity) {
        return activity.name == activity_name;
    });
    return activity.sign_ups;
}
SignUp.reconstruct_sign_up_message = function (sms_json) {
    var message = new SignUp(SignUp.get_message_content(sms_json), sms_json.messages[0].phone);
    return message;
}
SignUp.get_message_content = function (sms_json) {
    return sms_json.messages[0].message.substring(2).replace(/^\s+$/g, '');
}
SignUp.save_message_to_activities = function (message) {
    var activities = Activity.get_activities();
    var current_activity = activities[localStorage.current_activity];
    _.map(activities, function (activity) {
        if (activity.name == current_activity.name) {
            activity.sign_ups.unshift(message);
        }
    });
    Activity.save_activities(activities);
}
SignUp.judge_sign_up_is_repeat = function (message) {
    var activities = Activity.get_activities();
    return _.find(activities[localStorage.current_activity].sign_ups, function (sign_up) {
        return sign_up.phone == message.phone
    }) || false;
}
SignUp.check_sign_up_activity = function (message) {
    var is_repeat = SignUp.judge_sign_up_is_repeat(message);
    var is_signing_up = localStorage.is_signing_up;
    if (is_signing_up == 'true' && !is_repeat) {
        SignUp.save_message_to_activities(message);
    }
}
