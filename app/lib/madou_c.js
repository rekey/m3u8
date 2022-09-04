const curl = require('./curl');
const ObjectID = require("bson-objectid");
const urlLib = require('url');
const cheerio = require('cheerio');

async function parse(url) {
    const html = (await curl(url)).toString();
    const key = html.match(/share\/[0-9a-z]+/)[0].replace('share/', '');
    const cover = html.match(/https:\/\/madou\.club\/covers\/[0-9]+\/[0-9]+\/[0-9a-z]+\.[a-z]+/)[0];
    const shareUrl = `https://dash.madou.club/share/${key}`;
    const shareHtml = (await curl(shareUrl)).toString();
    const token = shareHtml.match(/var token = "(.*)";/ig)[0].replace('var token = "', '').replace('";', '').trim();
    const $ = cheerio.load(html);
    const $title = $('.article-title');
    const cates = [];
    const tags = [];
    const m3u8 = `https://dash.madou.club/videos/${key}/index.m3u8?token=` + token;
    $('.article-meta a').each((index, cate) => {
        cates.push($(cate).text());
    });
    $('.article-tags a').each((index, tag) => {
        tags.push($(tag).text());
    });
    return {
        m3u8,
        title: $title.text().replace(cates[0], '').replace(' / ', ' '),
        maker: cates.join('-'),
        tags: [].concat(cates, tags),
        cover,
        key,
    };
}

// parse('https://madou.club/mcy0065-%e9%9c%b8%e9%81%93%e8%a1%a8%e5%a7%90%e7%9a%84%e6%b7%ab%e4%b9%b1%e8%be%85%e5%af%bc.html')
//     .then(console.log);

module.exports = {
    parse
};
