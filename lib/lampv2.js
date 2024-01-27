const https = require('https');
const axios = require('axios');

class LampV2 {
    constructor(ip, lampid, username, password, max, min) {
        this.ip = ip;
        this.lampid = lampid;
        this.username = username;
        this.password = password;
        this.max = max;
        this.min = min;
        this.axiosInstance = axios.create({
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            })
        });
    }

    async getStatus() {
        const response = await this.axiosInstance.get(`https://${this.ip}/endpoints/call?key=CO@${this.lampid}&method=get&user=${this.username}&pw=${this.password}`);
        return response.data;
    }

    async setStatus(value) {
        const response = await this.axiosInstance.get(`https://${this.ip}/endpoints/call?key=CO@${this.lampid}&method=set&value=${value}&user=${this.username}&pw=${this.password}`);
        return response.data;
    }
}

module.exports = LampV2;
