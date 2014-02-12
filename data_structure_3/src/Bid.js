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