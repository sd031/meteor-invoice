"use strict";
Template.topbar.events({
    'keyup #search-query': function(event) {
        console.log('test1')
        var type = Session.get('type');
        var collection = type.collection;
        Session.set(collection + 'query', event.target.value);
        Session.set(collection + 'skip', 0);
    },
    'click #search-query': function(event) {
        if (event.target.value === '') {
            var collection = type.collection;
            var type = Session.get('type');
            Session.set(collection + 'query', '');
            Session.set(collection + 'skip', 0);
        }
    },
    'click #logout': function () {
        Meteor.logout();
    }
});

Template.topbar.isSelected = function (route) {
    console.log(Router.current());
    console.log(route);
    var current = Router.current();
    if (!current) return '';

    return current.template === route ? 'active' : '';

};

Template.topbar.items = function () {
    var items = [
        { name: 'Salg', path: Router.routes['main'].path({ root: 'sale', type: 'postedSalesinvoices' }) },
        { name: 'Køb', path: Router.routes['main'].path({ root: 'purchase', type: 'postedPurchaseinvoices' }) },
        { name: 'Kontaker', path: Router.routes['main'].path({ root: 'contacts', type: 'deptors' }) },
        { name: 'Varer', path: Router.routes['main'].path({ root: 'items', type: 'items' }) },
        { name: 'Posteringer', path: Router.routes['main'].path({ root: 'entries', type: 'itemEntries' }) },
        //{ name: 'Statistik', path: Router.routes['sale'].path({ type: '' }) },
        //{ name: 'Bogføring', path: Router.routes['sale'].path({ type: '' }) },
    ];
    var path = Router.current().path;
    items = _.map(items, function (item) {
        item.active = path.split('/')[1] == item.path.split('/')[1] ? 'active' : '';
        return item;
    });
    return items;
};
