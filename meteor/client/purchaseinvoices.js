

Template.postedPurchaseinvoices.created = function () {
    RenderList('purchaseinvoices');
    var list = [
    { name: 'Nummer', key: 'key'},
    { name: 'Navn', key: 'name'},
    { name: 'Email', key: 'email'},
    { name: 'Telefon', key: 'phone'},
    { name: 'Fax', key: 'fax'},
    { name: 'Adresse', key: 'address'},
    { name: 'By', key: 'city'},
    { name: 'Postnummer', key: 'zip'},
    { name: 'Att.', key: 'attention'},
    ];
    Session.set('modalFields', list);
}
Template.postedPurchaseinvoices.rendered = function () {
};

Template.postedPurchaseinvoices.items = function () {
    return PurchaseInvoices.find({}, { sort: { key: -1 }}); // .fetch();
};

Template.postedPurchaseinvoices.events({
    'click .show-button': function(event) {
        Router.go('show', { type: 'postedPurchaseinvoice', key: this._id.valueOf()  });
    },
});

//return true if element is processing
var processing = function (element, type) {
    var sent = element.sent && (element.sent[type] !== undefined);
    return sent && element.sent[type].state === 'processing'

}
Template.postedPurchaseinvoices.helpers({
    getDate: function(date) {
        return moment(date).format('DD MMM YYYY'); // + ' - ' + moment(date).fromNow();
    },
    sentBy: function(type) {
        if (!this.sent || !this.sent[type] || this.sent[type].state === 'processing')
            return '';
        // green if success, otherwise, must be error state
        return this.sent[type].state === 'success' ? 'btn-success' : 'btn-danger';
    },
    processing: function(type) {
        var state = processing(this, type) ? 'disabled'  : '';
        //if (sent && state !== 'disabled' && Session.get(type)) {
            //Session.set(type, null);
        //}
        return state;
    },
    showSpinner: function () {
        var isProcessing = processing(this, 'mail') || processing(this, 'amqp');
        return isProcessing ? 'display: inherit' : 'display:none';
    }
});
