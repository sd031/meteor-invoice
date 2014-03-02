CollectionCounts = new Meteor.Collection('counts');
Counters = new Meteor.Collection('counters');
Sale = new Meteor.Collection('sale');
Purchase = new Meteor.Collection('purchase');
Deptors = new Meteor.Collection('deptors');
Creditors = new Meteor.Collection('creditors');
Alerts = new Meteor.Collection('alerts');
TradeAccounts = new Meteor.Collection('accounts');
Items = new Meteor.Collection('items');
FinanceEntries = new Meteor.Collection('financeentries');

GetCurrentCollection = function (capitalize) {
    var typeName = Router.current().params.type;
    var capString = typeName.charAt(0).toUpperCase() + typeName.slice(1);
    return window[capString];
};

ClearFilters = function () {
var collections = [
    'Deptors',
    'Creditors',
    'Items',
    'FinanceEntries',
    'Sale',
    'Purchase',
    ];
    _.each(collections, function (collection) {
            Session.set(collection + 'limit', null),
            Session.set(collection + 'skip', null),
            Session.set(collection + 'query', null),
            Session.set(collection + 'filter', null)

    });
    //$('#search-query').val('');
    Session.set('viewTitle', '');
}

SetFilter = function(filter, extend, router) {
    var typeName = Router.current().params.type;
    var capString = typeName.charAt(0).toUpperCase() + typeName.slice(1);
    var mapping = GetCurrentMapping();
    if (extend) {
        var oldFilter = Session.get(mapping.collection + 'filter');
        filter = _.extend(oldFilter || {}, filter);
    }
    Session.set(mapping.collection + 'filter', filter);
    console.log(router)
    if (router) {
        //router.subscribe(mapping.collection, router.params.key).wait();
    }
};

GetCurrentMappingName = function () {
    return Router.current().params.type;
};
GetCurrentMapping = function () {
    return Mapping[Router.current().params.type];
};
GetCurrentCollectionName = function () {
    return Mapping[Router.current().params.type].collection
};
GetCurrentKey = function () {
    return Router.current().params.key;
};
GetCurrentType = function () {
    return Router.current().params.type;
};

GetDate = function (date) {
    if (date) {
        return moment(date).format('DD MMM YYYY');
    }
    else{
        return '';
    }
};
GetPrice = function (amount) {
        if(isNaN(amount)){
            var a = 0;
            return a.toFixed(2) ;
        }
        amount = amount/100;
        amount = amount.toFixed(2);
        //if(amount.length === 2){
        //return '00.' + amount;
        //}
    //var money = amount.substring(0, amount.length-2) + '.' + amount.substring(amount.length-2, amount.length);
    //return money;
        amount = amount + '';
        amount = amount.replace('.', ',');
        var val = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return val;
};
BuildLink = function (elem, props, key) { 
    console.log(key)
    if (props.key) {
        return props.root + props.map[elem[props.key]] + key;
    }
    else {
        return props.root + key;
    }
};


// these settings makes the stuff fit on the pdf conversion
lpp = 30;
lfirst = 18;
llast = 23;

Print = {
    totalPages: function (nLines) {
        var pages = 1;
        for(var i = 1; i <= nLines; i++) {
            if (i > lfirst +  lpp * (pages -  1)) {
                pages += 1;
            }
        };
        return pages;
    },
};

log = {
    log: function (level, args) {
            var caller_line = (new Error).stack.split("\n")[4]
            var now = moment().format('DD-MM-YY HH:mm:ss');
            var message = '';
            _.each(args, function (m, i) {
                message += JSON.stringify(m) + ' ';
            });
            console.log(level, ':', now, message, caller_line);
        }
}
log.info = function () {
    log.log('INFO   ', arguments);
}
log.debug = function () {
    log.log('DEBUG  ', arguments);
}
log.error = function () {
    log.log('ERROR  ', arguments);
}
log.warning = function () {
    log.log('WARNING', arguments);
}

