var startDate = new Date(2000, 1, 1)
var endDate;

var toDate = function(date) {
    var offset = date.getTimezoneOffset();
    var utc = date.getTime() - (date.getTimezoneOffset() * 60000);
    var res = moment(utc).utc().format('YYYY-MM-DDTHH:mm:ssZZ');
    return res;

    //return date.toDateString()
}
Template.itemstatsinner.rendered = function () {
    $('#stats-end-date').datepicker({ autoclose: true }).on('changeDate', function (e) {
        var elem = Session.get('element');
        endDate = e.date;
        var stats = Meteor.call('getItemStats', elem.elem.key, toDate(startDate), toDate(endDate), function (err, res) {
            Session.set('stats', res);
        });
    });
    $('#stats-start-date').datepicker({ autoclose: true }).on('changeDate', function (e) {
        var elem = Session.get('element');
        startDate = e.date || startDate;
        var stats = Meteor.call('getItemStats', elem.elem.key, toDate(startDate), toDate(endDate), function (err, res) {
            Session.set('stats', res);
        });
    });
    $('#stats-start-date').datepicker('update', new Date(2000, 1, 1));
    //var elem = Session.get('element');
    //var stats = Meteor.call('getItemStats', this.elem.key, function (err, res) {
        //Session.set('stats', res);
        //$('#itemstats').modal({});
}
Template.itemstatsinner.helpers({
    fields: function (element) {

    },
    messages: function () {
        return Messages.find().fetch();
        return [{ message: 'test'}]
        //Messages.find(); // .fetch();
    }
});

Template.itemstatsinner.events({

});
