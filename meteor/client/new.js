Template.new.created = function () {
    console.log('created');
    var elem = SalesInvoices.findOne( {key: 99999} );
    console.log(elem)
    if (!elem) {
        SalesInvoices.insert( {key: 99999, lines: [] });
    }
};

Template.new.newitem = function () {
    return SalesInvoices.findOne( {key: 99999} );
};

Template.new.rendered = function () {
    Session.set('type', Mapping['newSalesinvoice']);
    var elem = SalesInvoices.findOne( {key: 99999} );
    Session.set('element', elem);

    var query = SalesInvoices.find( {key: 99999} );
    var handle = query.observeChanges({changed: function(id, fields) {
        _.each(fields, function (v, k) {
            // go through every item line in case that property has changed
            if (k === 'lines') {
                _.each(fields.lines, function (line, index) {
                    // update each property of the line
                    _.each(line, function (value, key) {
                        $('#' + key + '-' + index).editable('setValue', value);
                    });
                });
            }
            else {
                $('#' + k).editable('setValue', v);
            }
        });

    }});

    $("#deptor-select").select2({
        placeholder: 'Kundenummer eller navn',
        minimumInputLength: 3,
        containerCss: { width: '600px' },
        query: function (query) {
            Meteor.call('DeptorsSearch', query.term, function (err, res) {
                var vals = [];
                res.forEach(function (v) {
                    var text = v.key + ', ' + v.name + ', ' + v.address + ', ' + v.city + ', ' + v.phone;
                    vals.push({text: text, id: v.key, data: v});
                });
                query.callback({ results: vals });
            });
        },
    });

    $("#item-select").select2({
        placeholder: 'Varenummer eller navn',
        minimumInputLength: 3,
        containerCss: { width: '600px' },
        query: function (query) {
            Meteor.call('ItemsSearch', query.term, function (err, res) {
                var vals = [];
                res.forEach( function (v) {
                    var text = v.key + ', ' + v.name + ', ' + v.cost_price + ', ' + v.group + ', ' + v.ean;
                    vals.push({text: text, id: v.key, data: v});
                });
                query.callback({ results: vals });
            });
        },
    });

    if (!Template.new.attached) {
        Template.new.attached = true;

        $("#deptor-select").on('change', function (val) {
            var type = Session.get('type');
            var elem = Session.get('element');
            props = val.added.data;

            var update = {};
            _.each(type.headerFields, function (map) {
                update[map.key] = props[map.from];

            });
            console.log(update);
            console.log(elem);
            var res = SalesInvoices.update({ _id: elem._id }, { $set: update });
        });

        $("#item-select").on('change', function (val) {
            props = val.added.data;
            var elem = Session.get('element');
            var update = {
                quantity: 1,
                info: props.name,
                item_number: props.key,
                price: props.price
            };
            var res = SalesInvoices.update({ _id: elem._id }, { $push: { lines: update } }, function (err, msg) {
                console.log(err, msg);
            });
        });
    }

    $.fn.editable.defaults.mode = 'inline';

    $('.new-edit-field').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            var elem = Session.get('element');
            var update = {};
            var field = $(this).attr('id');

            var parts = field.split('-');
            var key = parts[0];
            var id = parts[1];

            if (field === 'key') {
                Messages.insert({ message: 'Nøglen kan ikke ændres på nuværende tidspunkt.' });
                return;
            }
            elem.lines[id][key] = newValue;
            update[field] = newValue;

            console.log(elem.lines[id][key]);


            var res = SalesInvoices.update({ _id: elem.id }, { $set: update }, function (err, msg) {
                console.log(err, msg);
                if (err) {
                    var selector = '#' + field;
                    $(selector).editable('setValue', selected[field] , true);
                    Messages.insert({ message: 'Nøgle eksisterer allerede' });
                }
            });
        },
    });

};
