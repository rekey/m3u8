const { spawn } = require('child_process');

function curl(url, proxy) {
    return new Promise((resolve, reject) => {
        let args = [url];
        if (proxy) {
            args = ['-x', proxy].concat(args);
        }
        args.push('-H', 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0');
        let child = spawn('curl', args);
        let data = Buffer.from('');
        child.stdout.on('data', (chunk) => {
            data = Buffer.concat([data, chunk]);
        });
        child.once('exit', (code) => {
            process.nextTick(() => {
                child.stdout.removeAllListeners();
                child.kill(9);
            });
            if (code === 0) {
                resolve(data);
                return;
            }
            reject(code);
        });
    });
}

module.exports = curl;
