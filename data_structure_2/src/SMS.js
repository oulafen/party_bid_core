/**
 * Created by xiaofen on 14-2-11.
 */
var native_accessor = {

    send_sms: function (phone, message) {
        native_access.send_sms({"receivers": [
            {"name": 'name', "phone": phone}
        ]}, {"message_content": message});
    },

    receive_message: function (sms_json) {
        if (typeof this.process_received_message === 'function') {
            this.process_received_message(sms_json);
        }
    },

    process_received_message: function (sms_json) {
        if (!check_message(sms_json)) {
            return;
        }
        native_accessor[get_bm_or_jj(sms_json)](sms_json);
    },

    'BM': function (sms_json) {
        SMSSignUp.check_sign_up_activity(SMSSignUp.reconstruct_sign_up_message(sms_json));
    },
    'JJ': function (sms_json) {
        Bidding.check_bid_activity(Bidding.reconstruct_bid_message(sms_json));
    }
};
function check_message(message_json) {
    var message_flag = message_json.messages[0].message.substring(0, 2);
    if ((message_flag == 'JJ' || message_flag == 'BM') && message_json.messages[0].message.length > 2) {
        return true;
    }
}
function get_bm_or_jj(message_json) {
    return message_json.messages[0].message.substring(0, 2).toUpperCase();
}
function notify_sms_received(message_json) {
    native_accessor.receive_message(message_json);
}
function SMSSignUp(name,phone){
    this.name = name;
    this.phone = phone;
}
SMSSignUp.reconstruct_sign_up_message=function(sms_json) {
    var message = new SMSSignUp(SMSSignUp.get_message_content(sms_json), sms_json.messages[0].phone);
    return message;
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
    var act=activities[current_activity];
    _.map(activities, function (activity) {
        if (activity.name == act.name) {
            activity.sign_ups.unshift(message);
        }
    });
    localStorage.activities = JSON.stringify(activities);
}
SMSSignUp.judge_sign_up_is_repeat = function (message) {
    var activities=Activity.get_activities();
    return _.find(activities[localStorage.current_activity.sign_ups], function (sign_up) {
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
