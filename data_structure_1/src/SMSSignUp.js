/**
 * Created by xiaofen on 14-2-10.
 */
function SMSSignUp(name, phone) {
    this.name = name;
    this.phone = phone;
}
SMSSignUp.get_message_content = function (sms_json) {
    return sms_json.messages[0].message.substring(2).replace(/^\s+$/g, '');
}
SMSSignUp.reconstruct_sign_up_message = function (sms_json) {
    var message = new SMSSignUp(SMSSignUp.get_message_content(sms_json), sms_json.messages[0].phone);
    return message;
}
SMSSignUp.save_message_to_activities = function (message) {
    var activities = Activity.get_activities();
    var current_activity = localStorage.getItem('current_activity');
    _.map(activities, function (activity) {
        if (activity.name == current_activity) {
            activity.sign_ups.unshift(message);
        }
    });
    localStorage.activities = JSON.stringify(activities);
}
SMSSignUp.judge_sign_up_is_repeat = function (message) {
    return _.find(Activity.get_current_activity().sign_ups, function (sign_up) {
        return sign_up.phone == message.phone
    }) || false;
}
SMSSignUp.check_sign_up_activity = function (message) {
    var is_repeat = SMSSignUp.judge_sign_up_is_repeat(message);
    var is_signing_up = localStorage.is_signing_up;
    if (is_signing_up == 'true' && !is_repeat) {
        SMSSignUp.save_message_to_activities(message);
    }
}