const puppeteer = require('puppeteer');
const ObjectID = require("bson-objectid");
const urlLib = require('url');

const options = {
    ignoreHTTPSErrors: true,
    headless: false,
    devtools: true,
    defaultViewport: {
        width: 0,
        height: 0,
    },
    args: [
        '--start-maximized',
        '--ignore-urlfetcher-cert-requests',
        // '--no-sandbox'
    ],
};
const getBrowser = puppeteer.launch(options);

async function parse(url) {
    const browser = await getBrowser;
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
    });
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
        const u = urlLib.parse(interceptedRequest.url());
        if (!u.host.includes('madou.club')) {
            interceptedRequest.abort();
            return;
        }
        // console.log(interceptedRequest.url(), 'interceptedRequest.continue();');
        interceptedRequest.continue();
    });
    await page.goto(
        url,
        {
            waitUntil: ['load'],
            timeout: 60000,
        }
    );
    const data = await page.evaluate(async () => {
        const $iframe = jQuery('.article-content iframe');
        const shareUrl = $iframe.attr('src');
        const key = shareUrl.split('/')[4];
        const html = await jQuery.ajax(shareUrl);
        const arr = html.match(/var token = "(.*)";/ig)[0];
        const token = arr.replace('var token = "', '').replace('";', '');
        const m3u8 = `https://dash.madou.club/videos/${key}/index.m3u8?token=` + token;
        const $title = $('.article-title');
        const cates = Array.from(document.querySelectorAll('.article-meta a'), (tag) => {
            return tag.innerHTML;
        });
        const tags = Array.from(document.querySelectorAll('.article-tags a'), (tag) => {
            return tag.innerHTML;
        });
        const data = {
            m3u8,
            title: $title.text().replace(cates[0], '').replace(' / ', ' '),
            maker: cates.join('-'),
            tags: [].concat(cates, tags),
            cover: window.TBUI.shareimage,
            key,
        };
        return data;
    });
    process.nextTick(() => {
        page.close().catch(console.error);
    });
    const oid = ObjectID(data.key);
    data.date = new Date(oid.getTimestamp());
    data.url = url;
    return data;
}

module.exports = {
    parse
};
