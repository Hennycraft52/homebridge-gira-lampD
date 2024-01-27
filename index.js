let Service, Characteristic;
const LampV2 = require('./lib/lampv2');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-gira-lampd', 'LampV2', LampAccessory);
};

function LampAccessory(log, config) {
    this.log = log;
    this.lamp = new LampV2(config.ip, config.lampid, config.username, config.password);
}

LampAccessory.prototype = {
    getServices: function() {
        let lightbulbService = new Service.Lightbulb(this.name);

        lightbulbService
            .getCharacteristic(Characteristic.On)
            .on('get', this.getOn.bind(this))
            .on('set', this.setOn.bind(this));

        lightbulbService
            .addCharacteristic(new Characteristic.Brightness())
            .on('get', this.getBrightness.bind(this))
            .on('set', this.setBrightness.bind(this));

        return [lightbulbService];
    },

    getOn: function(callback) {
    this.lamp.getStatus().then(status => {
        callback(null, status > 0); // Die Lampe ist eingeschaltet, wenn der Status größer als 0 ist
    }).catch(err => {
        callback(err);
    });
},


    setOn: function(value, callback) {
        this.lamp.setStatus(value ? 100 : 0).then(() => {
            callback(null);
        }).catch(err => {
            callback(err);
        });
    },

    getBrightness: function(callback) {
        this.lamp.getStatus().then(status => {
            if (isNaN(status)) {
                callback(new Error('Status is NaN'));
            } else {
                callback(null, status);
            }
        }).catch(err => {
            callback(err);
        });
    },

    setBrightness: function(value, callback) {
        if (isNaN(value)) {
            callback(new Error('Value is NaN'));
        } else {
            this.lamp.setStatus(value).then(() => {
                callback(null);
            }).catch(err => {
                callback(err);
            });
        }
    }
};
