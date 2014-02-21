function Bid(activity_id) {
    this.name = '';
    this.activity_id = activity_id;
    this.biddings = []
}

Bid.create_new_bid = function (activity_id) {
    var bid = new Bid(activity_id);
    var bids = JSON.parse(localStorage.bids);
    bid.name = '竞价' + (bids.length + 1);
    bids.push(bid);
    localStorage.bids = JSON.stringify(bids);
}

Bid.render_bids = function (activity_id) {
    return _.filter(JSON.parse(localStorage.bids), function (bid) {
        return bid.activity_id == activity_id;
    });
}