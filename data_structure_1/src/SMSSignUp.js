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
SMSSignUp.save_message_to_activities = function (sms_json) {
    var message = SMSSignUp.reconstruct_sign_up_message(sms_json);
    var activities = Activity.get_activities();
    var current_activity = localStorage.getItem('current_activity');
    _.map(activities, function (activity) {
        if (activity.name == current_activity) {
            activity.sign_ups.unshift(message);
        }
    });
    localStorage.activities = JSON.stringify(activities);
}
