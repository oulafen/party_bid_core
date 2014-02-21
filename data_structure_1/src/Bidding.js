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
    var bid_is_repeat = Bidding.judge_bid_is_repeat(message);
    if (is_bidding == 'true' && user_signed_up && !bid_is_repeat) {
        Bidding.save_bid_message_to_activities(message);
    }
}

Bidding.judge_bid_is_repeat = function (message) {
    var biddings = Bidding.get_current_biddings();
    return _.find(biddings, function (bidding) {
        return bidding.phone == message.phone;
    }) || false;
}

Bidding.get_current_biddings = function () {
    var activity = Activity.get_current_activity();
    var bid = _.find(activity.bids, function (bid) {
        return bid.name == localStorage.current_bid;
    });
    return bid.biddings;
}

Bidding.judge_user_signed_up = function (message) {
    var current_activity = Activity.get_current_activity();
    return _.find(current_activity.sign_ups, function (sign_up) {
        return sign_up.phone == message.phone;
    });
}

Bidding.get_winner = function (activity_name, bid_name) {
    var biddings_in_order = Bidding.get_biddings_by_price(activity_name, bid_name);
    var biddings_in_kinds = [];
    _.each(biddings_in_order, function (bid) {
        var bidding = _.filter(biddings_in_order, function (bidding) {
            return  bidding.price == bid.price;
        });
        biddings_in_kinds.push(bidding);
    });
    return _.find(biddings_in_kinds, function (bidding) {
        return bidding.length == 1;
    });
}

Bidding.get_biddings_by_price = function (activity_name, bid_name) {
    var activity = Activity.get_activity_by_activity_name(activity_name)
    var bid = _.find(activity.bids, function (bid) {
        return bid.name == bid_name;
    })
    return _.sortBy(bid.biddings, function (bidding) {
        return bidding.price;
    });
}
function transform_biddings_to_view_model(activity_name, bid_name) {
    var win_bidding = Bidding.get_winner(activity_name, bid_name);
    return win_bidding;
}