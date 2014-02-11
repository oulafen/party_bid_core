/**
 * Created by xiaofen on 14-2-10.
 */
function Bidding(name, price, phone) {
    this.name = name;
    this.price = price;
    this.phone = phone;
}
Bidding.reconstruct_bid_message = function (sms_json) {
    var message_content = SMSSignUp.get_message_content(sms_json);
    var bid_people = Bidding.get_bid_people_by_phone(sms_json.messages[0].phone);
    if (bid_people != null) {
        var message = new Bidding(bid_people.name, message_content, sms_json.messages[0].phone);
        return message;
    }
}
Bidding.get_bid_people_by_phone = function (phone) {
    return _.find(Activity.get_current_activity().sign_ups, function (bid_people) {
        return bid_people.phone == phone
    }) || {};
}
Bidding.save_bid_message_to_activities = function (message) {
    var activities = Activity.get_activities();
    var activity = Activity.get_current_activity();
    _.each(activity.bids, function (bid) {
        if (bid.name == localStorage.current_bid) {
            bid.biddings.unshift(message);
        }
    });
    _.map(activities, function (active) {
        if (active.name == activity.name) {
            active.bids = activity.bids;
        }
        return active
    });
    localStorage.activities = JSON.stringify(activities);
}
Bidding.check_bid_activity = function (message) {
    var is_bidding = localStorage.is_bidding;
    var user_signed_up = Bidding.judge_user_signed_up(message);
    if (is_bidding == 'true' && user_signed_up) {
        Bidding.save_bid_message_to_activities(message);

    }
}
Bidding.judge_user_signed_up = function (message) {
    var current_activity = Activity.get_current_activity();
    return _.find(current_activity.sign_ups, function (sign_up) {
        return sign_up.phone == message.phone;
    });
}