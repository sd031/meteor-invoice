DeptorSearchFields = [ 'key', 'name' ];
CreditorSearchFields = [ 'key' ];
ItemSearchFields = [ 'key' ];
FinanceEntriesSearchFields = [ 'key' ];
PurchaseSearchFields = [ 'key' ];
SaleSearchFields = [ 'key', 'name', 'customer_number'];

var queryMinLength = 2;
//var invoiceSearchFields = [ 'customer_number', '_id', 'name', 'city', 'zip' ];

FilterQuery = function (collection, fields, query, merger) {
    if (!merger) merger = { options: {}};
    if (!merger.options) merger.options = {};

    var filter = {};
    if (query && query.length >= queryMinLength) {
        range = query.split('..');
        if (range.length == 2) {
            filter = { $and : [ { key: { $gte: parseInt(range[0]) } }, { key: { $lte: parseInt(range[1]) }} ] };
        }
        else {
            list = _.map(fields, function (field) {
                var obj = {};
                obj[field] = { '$regex': query, '$options': 'i' };
                return obj;
            });
            var number = parseInt(query);
            if (!isNaN(number) && isFinite(query)) {
                list.push({ 'key': number });
            }
            filter = { $or : list };
        }
    }
    if (!merger.options.limit) merger.options.limit = 10;


    var sort = merger.filter && merger.filter.sort ? merger.filter.sort : { key: -1};
    if(merger.filter && merger.filter.sort)
        delete merger.filter.sort;

     
    var finalQuery = {}
    //hack to allow us to use 123..234 syntax, TODO: fix this and simplify input
   if(filter.$and) {
       finalQuery = filter;
   } else {
        finalQuery = _.extend(filter, merger.filter);
   }

    var options = _.extend(merger.options, { sort: sort });
    var options = merger.options
    console.log(finalQuery, options, collection._name);
    return collection.find(finalQuery, options);
};
Meteor.publish('DeptorPostings', function (limit, skip, query, filter){
    if (!this.userId) {
        this.ready();
        return;
    }
    return FilterQuery(Sale, SaleSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('Sale', function (limit, skip, query, filter){
    if (!this.userId) {
        this.ready();
        return;
    }
    return FilterQuery(Sale, SaleSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('History', function (limit, skip, query, filter){
    if (!this.userId) {
        this.ready();
        return;
    }
    return FilterQuery(History,[], query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('Purchase', function (limit, skip, query, filter){
    if (!this.userId) {
        this.ready();
        return;
    }
    return FilterQuery(Purchase, PurchaseSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('Deptors', function (limit, skip, query, filter){
    if (!this.userId) {
        this.ready();
        return;
    }
    return FilterQuery(Deptors, DeptorSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('Creditors', function (limit, skip, query, filter){
    if (!this.userId) {
        this.ready();
        return;
    }
    return FilterQuery(Creditors, CreditorSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('Items', function (limit, skip, query, filter){
    if (!this.userId) {
        this.ready();
        return;
    }
    return FilterQuery(Items, ItemSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('FinanceEntries', function (limit, skip, query, filter){
    if (!this.userId) {
        this.ready();
        return;
    }
    return FilterQuery(FinanceEntries, FinanceEntriesSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('alertChannel', function (){
    if (!this.userId) {
        this.ready();
        return;
    }
    return Alerts.find();
});
Meteor.publish('MailGroups', function (){
    if (!this.userId) {
        this.ready();
        return;
    }
    return MailGroups.find();
});
Meteor.publish('TradeAccounts', function (){
    if (!this.userId) {
        this.ready();
        return;
    }
    return TradeAccounts.find();
});
Meteor.publish('CollectionCounts', function (collection){
    if (!this.userId) {
        this.ready();
        return;
    }
    return CollectionCounts.find();
});
Meteor.publish('Custom', function (collection, query){
    if (!this.userId) {
        this.ready();
        return;
    }
    return global[collection].find(query);
});
