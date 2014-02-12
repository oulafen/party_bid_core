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
    var current_bid = Bidding.get_current_bid();
    current_bid[0].biddings.push(message);
    _.map(bids, function (bid) {
        if (bid.activity_id == localStorage.current_activity && bid.name == localStorage.current_bid) {
            bid.biddings = current_bid[0].biddings;
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
Bidding.get_current_bid = function () {
    var bids = JSON.parse(localStorage.bids);
    return _.chain(bids)
        .filter(function (bid) {
            return bid.activity_id == localStorage.current_activity;
        })
        .filter(function (bid) {
            return bid.name = localStorage.current_bid;
        })
        .value();
}
Bidding.judge_bid_is_repeat = function (message) {
    var current_bid = Bidding.get_current_bid();
    return _.find(current_bid[0].biddings, function (bidding) {
        return bidding.phone == message.phone;
    }) || false;
}
Bidding.judge_user_signed_up = function (message) {
    var sign_ups = JSON.parse(localStorage.sign_ups);
    var current_sign_ups = _.filter(sign_ups, function (sign_up) {
        return sign_up.activity_id == localStorage.current_activity;
    });
    return _.find(current_sign_ups, function (sign_up) {
        return sign_up.phone == message.phone;
    }) || false;
}
Bidding.render_biddings=function(activity_id,bid_name){

}