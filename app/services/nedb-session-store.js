var Nedb = require('nedb');

module.exports = function (session) {
    function NedbStore(options, cb) {
        var callback = cb || function () {};

        this.filename = options.filename;
        this.db = new Nedb(options.filename);
        this.db.loadDatabase(callback);
    }

    NedbStore.prototype.__proto__ = session.Store.prototype;

    NedbStore.prototype.get = function (sid, callback) {
        this.db.findOne({ sid: sid }, function (err, sess) {
            if (err) { return callback(err); }
            if (!sess) { return callback(null, null); }

            return callback(null, sess.data);
        });
    };

    NedbStore.prototype.set = function (sid, data, callback) {
        this.db.update(
            { sid: sid },
            { sid: sid, data: data },
            { multi: false, upsert: true }, function (err) {
            return callback(err);
        });
    };

    NedbStore.prototype.destroy = function (sid, callback) {
        this.db.remove({ sid: sid }, { multi: false }, function (err) {
            return callback(err);
        });
    };

    return NedbStore;
};