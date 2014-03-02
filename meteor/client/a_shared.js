Messages = new Meteor.Collection(null);
incrementSize = 10;
Session.set('limit', incrementSize);


Meteor.subscribe('TradeAccounts');
Meteor.subscribe('alertChannel');

Subs = []
var collections = [
    'Deptors',
    'Creditors',
    'Items',
    'FinanceEntries',
    'Sale',
    'Purchase',
    ];
Deps.autorun(function() {
    var progressCount = 1;
    try {
        NProgress.start();
    }
    catch (err) {
        log.error('err', err);
    }
    Subs = []
    _.each(collections, function (collection) {
        //progressCount += 1
        console.log(Session.get(collection + 'limit'), 'test', collection)
        var handle = Meteor.subscribe(collection,
            Session.get(collection + 'limit'),
            Session.get(collection + 'skip'),
            Session.get(collection + 'query'),
            Session.get(collection + 'filter'),
            function () {
                progressCount -= 1;
                if (progressCount <= 0) {
                    NProgress.done();
                }
            });
        Subs.push(handle);

    });
});
Deps.autorun(function () {
    var type = Session.get('type');
    if (type) {
        Meteor.subscribe("CollectionCounts", type.collection, type.filter || {});
    }
});
