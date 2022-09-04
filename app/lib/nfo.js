const fs = require("fs");
const dayjs = require("dayjs");

function parse(data) {
    const nfo = JSON.parse(fs.readFileSync(__dirname + '/nfo.json', 'utf-8'));
    const title = {
        _text: data.title.trim(),
    };
    const maker = {
        _text: data.maker,
    };
    const cover = {
        _text: 'poster.jpg',
    };
    const tag = data.tags.map((item) => {
        return {
            _text: item,
        };
    });
    Object.assign(nfo.movie, {
        title,
        originaltitle: title,
        label: title,
        plot: title,
        maker,
        studio: maker,
        tag,
        genre: tag,
        cover,
        dateadded: {
            _text: dayjs().format('YYYY-MM-DD HH:mm:ss')
        },
        premiered: {
            _text: dayjs(data.date).format('YYYY-MM-DD HH:mm:ss')
        },
        releasedate: {
            _text: dayjs(data.date).format('YYYY-MM-DD HH:mm:ss')
        },
        release: {
            _text: dayjs(data.date).format('YYYY-MM-DD HH:mm:ss')
        },
        year: {
            _text: dayjs(data.date).format('YYYY')
        },
    });
    nfo.movie.art.poster = cover;
    return nfo;
}

module.exports = {
    parse
};
