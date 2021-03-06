function Bidding(price, phone) {
    this.price = price;
    this.phone = phone
}

Bidding.reconstruct_bid_message = function (sms_json) {
    var message_content = SignUp.get_message_content(sms_json);
    return new Bidding(message_content, sms_json.messages[0].phone);
}

Bidding.save_bid_message_to_bids = function (message) {
    var bids = JSON.parse(localStorage.bids);
    var current_biddings = Bidding.get_biddings(localStorage.current_activity, localStorage.current_bid);
    current_biddings.push(message);
    _.map(bids, function (bid) {
        if (bid.activity_id == localStorage.current_activity && bid.name == localStorage.current_bid) {
            bid.biddings = current_biddings;
        }
        return bid;
    });
    localStorage.bids = JSON.stringify(bids);
}

Bidding.check_bid_activity = function (message) {
    var is_bidding = localStorage.is_bidding;
    var user_signed_up = Bidding.judge_user_signed_up(message);
    var bid_is_repeat = Bidding.judge_bid_is_repeat(message);
    if (is_bidding == 'true' && user_signed_up && !bid_is_repeat) {
        Bidding.save_bid_message_to_bids(message);
    }
}

Bidding.judge_bid_is_repeat = function (message) {
    var current_biddings = Bidding.get_biddings(localStorage.current_activity, localStorage.current_bid);
    return _.find(current_biddings, function (bidding) {
        return bidding.phone == message.phone;
    }) || false;
}

Bidding.judge_user_signed_up = function (message) {
    var current_sign_ups = SignUp.get_current_sign_ups();
    return _.find(current_sign_ups, function (sign_up) {
        return sign_up.phone == message.phone;
    }) || false;
}

Bidding.get_biddings = function (activity_id, bid_name) {
    var bids = JSON.parse(localStorage.bids);
    var current_bid = _.chain(bids)
        .filter(function (bid) {
            return bid.activity_id == activity_id;
        })
        .filter(function (bid) {
            return bid.name == bid_name;
        })
        .value();
    return current_bid[0].biddings;
}

Bidding.get_biddings_in_order = function (activity_id, bid_name) {
    var biddings = Bidding.get_biddings(activity_id, bid_name);
    return _.sortBy(biddings, function (bidding) {
        return bidding.price;
    });
}

Bidding.get_biddings_in_same_price = function (activity_id, bid_name) {
    var biddings_in_order = Bidding.get_biddings_in_order(activity_id, bid_name);
    var bidding_in_same_price = [];
    _.each(biddings_in_order, function (bid) {
        var prices = _.filter(biddings_in_order, function (bidding) {
            return bidding.price == bid.price;
        });
        bidding_in_same_price.push(prices);
    });
    return bidding_in_same_price;
}

Bidding.get_win_bidding = function (activity_id, bid_name) {
    var bidding_in_same_price = Bidding.get_biddings_in_same_price(activity_id, bid_name)
    return _.find(bidding_in_same_price, function (bidding) {
        return bidding.length == 1;
    });
}

Bidding.render_biddings = function (activity_id, bid_name) {
    var win_bidding = Bidding.get_win_bidding(activity_id, bid_name);
    _.each(JSON.parse(localStorage.sign_ups), function (sign_up) {
        if (sign_up.activity_id == activity_id && sign_up.phone == win_bidding[0].phone) {
            win_bidding[0].name = sign_up.name;
        }
    });
    return win_bidding;
}