function Bidding(price, phone) {
    this.price = price;
    this.phone = phone;
}
Bidding.create_new_bid = function (activity_id) {
    var activities = Activity.get_activities();
    var bids = activities[activity_id].bids;
    var new_bid_name = '竞价' + (bids.length + 1);
    activities[activity_id].bids.push(new_bid_name);
    activities[activity_id].biddings[new_bid_name] = [];
    Activity.save_activities(activities);
}
Bidding.reconstruct_bid_message = function (sms_json) {
    var message_content = SignUp.get_message_content(sms_json);
    return new Bidding(message_content, sms_json.messages[0].phone);
}
Bidding.save_bid_message_to_activities = function (message) {
    var activities = Activity.get_activities();
    activities[localStorage.current_activity].biddings[localStorage.current_bid].push(message);
    Activity.save_activities(activities);
}
Bidding.check_bid_activity = function (message) {
    var is_bidding = localStorage.is_bidding;
    var user_signed_up = Bidding.judge_user_signed_up(message);
    var bid_is_repeat = Bidding.judge_bid_is_repeat(message);
    if (is_bidding == 'true' && user_signed_up && !bid_is_repeat) {
        Bidding.save_bid_message_to_activities(message);
    }
}
Bidding.judge_bid_is_repeat = function (message) {
    var biddings = Bidding.get_current_bidding();
    return _.find(biddings, function (bidding) {
        return bidding.phone == message.phone;
    }) || false;
}
Bidding.judge_user_signed_up = function (message) {
    var activities = Activity.get_activities();
    return _.find(activities[localStorage.current_activity].sign_ups, function (sign_up) {
        return sign_up.phone == message.phone;
    }) || false;
}
Bidding.get_current_bidding = function () {
    var activities = Activity.get_activities();
    return activities[localStorage.current_activity].biddings[localStorage.current_bid];
}
Bidding.get_bids_by_activity_id = function (activity_id) {
    var activities = Activity.get_activities();
    return activities[activity_id].bids;
}
Bidding.get_win_bidding = function (activity_id, bid_name) {
    var activities = Activity.get_activities();
    var bidding_in_order = _.sortBy(activities[activity_id].biddings[bid_name], function (bidding) {
        return bidding.price;
    });
    var bidding_in_kinds = [];
    _.each(bidding_in_order, function (bid) {
        var prices = _.filter(bidding_in_order, function (bidding) {
            return bidding.price == bid.price;
        });
        bidding_in_kinds.push(prices);
    });
//    bidding_in_kinds= _.chain(bidding_in_order)
//        .filter(function(bid){
//
//        })
    return _.find(bidding_in_kinds, function (bidding) {
        return bidding.length == 1;
    });
}
function transform_bids_to_view_model(activity_id) {
    return Bidding.get_bids_by_activity_id(activity_id);
}
function transform_biddings_to_view_model(activity_id, bid_name) {
    var win_bidding = Bidding.get_win_bidding(activity_id, bid_name);
    var activities = Activity.get_activities();
    win_bidding[0].name = _.find(activities[activity_id].sign_ups,function (sign_up) {
        return sign_up.phone == win_bidding[0].phone;
    }).name;
    return win_bidding;
}