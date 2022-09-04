const xml = require("xml-js");
const fs = require("fs");
const path = require('path');
const request = require('request');
const dayjs = require("dayjs");
const downloader = require('../lib/m3u8_multi_downloader');

const storeSvc = require('./store');
const madou = require('../lib/madou_c');
const nfo = require('../lib/nfo');

const log = console.log;
console.log = (...args) => {
    args.unshift(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'));
    log(...args);
};

const mediaDir = path.resolve(__dirname, '../media');

async function run(url) {
    const data = await madou.parse(url);
    storeSvc.infoUpdate(url, 'data', 1);
    console.log(url, 'data', 'done');
    console.log(data);
    const nfoData = nfo.parse(data);
    const cateDir = path.resolve(mediaDir, data.maker);
    const movieDir = path.resolve(cateDir, data.key);
    fs.rmdirSync(movieDir);
    if (!fs.existsSync(movieDir)) {
        fs.mkdirSync(movieDir, {
            recursive: true,
        });
    }
    const xmlContent = xml.json2xml(JSON.stringify(nfoData), { compact: true, spaces: 4 });
    fs.writeFileSync(movieDir + `/movie.nfo`, xmlContent, 'utf-8');
    storeSvc.infoUpdate(url, 'nfo', 1);
    console.log(url, 'nfo', 'done');
    await new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(movieDir + `/poster.jpg`);
        request(data.cover).pipe(stream).on("close", function (err) {
            if (err) {
                reject(err);
                console.log(url, 'image', 'err', err.message);
                return;
            }
            resolve();
            storeSvc.infoUpdate(url, 'image', 1);
            console.log(url, 'image', 'done');
        });
    });
    await new Promise((resolve, reject) => {
        downloader.download({
            url: data.m3u8,
            processNum: 10,
            filePath: movieDir,
            filmName: 'movie',
        }, (err, resp) => {
            if (err) {
                reject(err);
                console.log(url, 'video', 'err', err.message);
                return;
            }
            storeSvc.infoUpdate(url, 'video', 1);
            fs.renameSync(movieDir + '/movie/movie.mp4', movieDir + '/movie.mp4');
            fs.rmdirSync(movieDir + '/movie');
            console.log(url, 'video', 'done');
            resolve();
        });
    });
}

module.exports = {
    start() {
        (async () => {
            let errorTime = 1;
            let canRun = true
            while (canRun) {
                const tasks = storeSvc.all();
                console.log(tasks.length);
                if (tasks.length === 0) {
                    console.log('no task');
                    await new Promise((resolve) => {
                        setTimeout(resolve, 10000 * errorTime);
                    });
                    continue;
                }
                const url = tasks[0];
                try {
                    await run(url);
                } catch (e) {
                    console.erroe(url, 'err', e.message);
                    errorTime += 1;
                    await new Promise((resolve) => {
                        setTimeout(resolve, 10000 * errorTime);
                    });
                    continue;
                }
                storeSvc.remove(url);
                errorTime = 1;
                await new Promise((resolve) => {
                    setTimeout(resolve, 10000 * errorTime);
                });
            }
        })();
    }
};
