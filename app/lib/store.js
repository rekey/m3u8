const fs = require('fs');

class Store {
    data = {};
    dataFile = '';

    constructor(dataFile) {
        this.dataFile = dataFile;
        try {
            const content = fs.readFileSync(this.dataFile, 'utf8');
            this.data = JSON.parse(content);
        } catch (e) {
            // console.error(e);
        }
    }

    set(key, value, expire = 1000 * 60 * 60) {
        this.data[key] = {
            now   : Date.now(),
            value : value,
            expire,
        };
        fs.writeFileSync(
            this.dataFile,
            JSON.stringify(this.data, null, 4),
            'utf8'
        );
    }

    get(key) {
        const data = this.data[key];
        if (!data) {
            return null;
        }
        if (data.expire === 0 || Date.now() - data.now < data.expire) {
            return data.value || null;
        }
        return null;
    }

    clear() {
        this.data = {};
        fs.writeFileSync(
            this.dataFile,
            JSON.stringify(this.data, null, 4),
            'utf8'
        );
    }
}

module.exports = Store;
