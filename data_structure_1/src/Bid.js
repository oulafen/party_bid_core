/**
 * Created by xiaofen on 14-2-10.
 */
function Bid(name, biddings) {
    this.name = name;
    this.biddings = biddings;
}
Bid.create_new_bid = function (active_name) {
    var bid_name = Bid.get_bid_name();
    var bid = new Bid(bid_name, []);
    var bids = Activity.get_current_activity().bids;
    bids.push(bid);
    var activities = Activity.get_activities();
    _.map(activities, function (activity) {
        if (activity.name == active_name) {
            activity.bids = bids;
        }
    });
    localStorage.activities = JSON.stringify(activities);
}
Bid.get_bid_name = function () {
    return ('竞价' + (Activity.get_current_activity().bids.length + 1));
}
Bid.get_bids = function (activity_name) {
    var activity = Activity.get_activity_by_activity_name(activity_name);
    return activity.bids;
}
function transform_bids_to_view_model(activity_name) {
    return Bid.get_bids(activity_name);
}