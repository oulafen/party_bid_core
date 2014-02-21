/**
 * Created by xiaofen on 14-2-10.
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
/*
 notify_message_received({"messages": [
 {"create_date": "Tue Jan 15 15:28:44 格林尼治标准时间+0800 2013", "message": "bm1", "phone": "181717833"}
 ]})

 */
