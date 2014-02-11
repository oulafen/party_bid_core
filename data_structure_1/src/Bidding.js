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
        var message = new Bidding(bid_people.name, message_content,sms_json.messages[0].phone);
        return message;
    }
}
Bidding.get_bid_people_by_phone = function (phone) {
    return _.find(Activity.get_current_activity().sign_ups, function (bid_people) {
        return bid_people.phone == phone
    }) || {};
}
Bidding.save_bid_message_to_activities=function(sms_json){
    var bidding=Bidding.reconstruct_bid_message(sms_json);
    var activities = Activity.get_activities();
    var activity = Activity.get_current_activity();
    _.each(activity.bids, function (bid) {
        if (bid.name == localStorage.current_bid) {
            bid.biddings.unshift(bidding);
        }
    });
    _.map(activities, function(active) {
        if (active.name == activity.name) {
            active.bids = activity.bids;
        }
        return active
    });
    localStorage.activities=JSON.stringify(activities);
}
Bidding.check_bid_activity = function (message) {
    Bidding.bid_status_map[localStorage.is_bidding](message);

}
Bidding.bid_status_map = {
    'null': function () {
        console.log('对不起，竞价活动还没开始！');
    },
    'yellow': function (message) {
        if (!Bidding.judge_jj_repeat(message.phone)) {
            Bidding.save_bid_message_to_activities(message);
            console.log('恭喜！您已竞价成功！');
        } else {
            console.log('您已成功出价，请勿重复出价');
        }
    },
    'lightgray': function () {
        console.log('对不起，竞价活动已结束。');
    }
}
Bidding.judge_jj_repeat = function (phone) {
    if (localStorage.current_bid) {
        return _.find(Bid.get_present_bid_peoples(), function (bid_people) {
            return bid_people.phone == phone;
        });
    } else {
        return false;
    }
}
Bid.get_current_bidings = function () {
    return _.find(Activity.get_current_activity().bids, function (biding) {
        return biding.bid_name == localStorage.getItem('present_biding_name')
    }) || [];
}