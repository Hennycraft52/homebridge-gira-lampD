const LampV2 = require('./lib/lampv2');

module.exports = function(homebridge) {
    homebridge.registerAccessory('homebridge-gira-lampV2', 'LampV2', LampAccessory);
};

function LampAccessory(log, config) {
    this.log = log;
    this.lamp = new LampV2(config.ip, config.lampid, config.username, config.password, config.max, config.min);
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
            callback(null, status);
        }).catch(err => {
            callback(err);
        });
    },

    setOn: function(value, callback) {
        this.lamp.setStatus(value ? this.max : this.min).then(() => {
            callback(null);
        }).catch(err => {
            callback(err);
        });
    },

    getBrightness: function(callback) {
        this.lamp.getStatus().then(status => {
            let brightness = Math.round((status - this.min) / (this.max - this.min) * 100);
            callback(null, brightness);
        }).catch(err => {
            callback(err);
        });
    },

    setBrightness: function(value, callback) {
        let status = Math.round(value / 100 * (this.max - this.min) + this.min);
        this.lamp.setStatus(status).then(() => {
            callback(null);
        }).catch(err => {
            callback(err);
        });
    }
};
