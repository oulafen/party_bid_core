/**
 * Created by xiaofen on 14-2-12.
 */
function SignUp(name, phone, activity_id) {
    this.name = name;
    this.phone = phone;
    this.activity_id = activity_id
}
SignUp.render_sign_ups = function (activity_id) {
    var sign_ups = JSON.parse(localStorage.sign_ups);
    return _.filter(sign_ups, function (sign_up) {
        return sign_up.activity_id == activity_id;
    });
}
SignUp.reconstruct_sign_up_message = function (sms_json) {
    var message = new SignUp(SignUp.get_message_content(sms_json), sms_json.messages[0].phone, localStorage.current_activity);
    return message;
}
SignUp.get_message_content = function (sms_json) {
    return sms_json.messages[0].message.substring(2).replace(/^\s+$/g, '');
}
SignUp.save_message_to_sign_ups = function (message) {
    var sign_ups = JSON.parse(localStorage.sign_ups);
    sign_ups.push(message);
    localStorage.sign_ups = JSON.stringify(sign_ups);
}
SignUp.judge_sign_up_is_repeat = function (message) {
    var sign_ups = SignUp.render_sign_ups(localStorage.current_activity);
    return _.find(sign_ups, function (sign_up) {
        return sign_up.phone == message.phone
    }) || false;
}
SignUp.check_sign_up_activity = function (message) {
    var is_repeat = SignUp.judge_sign_up_is_repeat(message);
    var is_signing_up = localStorage.is_signing_up;
    if (is_signing_up == 'true' && !is_repeat) {
        SignUp.save_message_to_sign_ups(message);
    }
}
SignUp.get_current_sign_ups=function(){
    var sign_ups = JSON.parse(localStorage.sign_ups);
    return _.filter(sign_ups, function (sign_up) {
        return sign_up.activity_id == localStorage.current_activity;
    });
}