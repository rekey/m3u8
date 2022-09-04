const path = require('path');
const fs = require('fs');

const Store = require('../lib/store');

const dataDir = path.resolve(__dirname, '../store');
const dataFile = path.resolve(dataDir, 'data.json');

fs.mkdirSync(dataDir, {
    recursive: true,
});

const store = new Store(dataFile);

function add(url) {
    const task = store.get('task') || [];
    const done = store.get('done') || [];
    if (!task.includes(url) && !done.includes(url)) {
        task.push(url);
    }
    store.set('task', task, 0);
}

function all() {
    return store.get('task') || [];
}

function remove(url) {
    const task = store.get('task') || [];
    const done = store.get('done') || [];
    if (!done.includes(url)) {
        done.push(url);
    }
    store.set('done', done, 0);
    store.set('task', task.filter((item) => {
        return item !== url;
    }), 0);
}

function infoAll() {
    return store.get('info') || {};
}

function infoItem(url) {
    const info = infoAll();
    return info[url] || {};
}

function infoRemove(url) {
    const info = infoAll();
    delete info[url];
    store.set('info', info, 0);
}

function infoUpdate(url, field, value) {
    const info = store.get('info') || {};
    const item = info[url] || {};
    Object.assign(item, {
        [field]: value,
    });
    info[url] = item;
    console.log(item);
    store.set('info', info, 0);
}

module.exports = {
    add,
    remove,
    all,
    infoAll,
    infoItem,
    infoUpdate,
    infoRemove,
};
