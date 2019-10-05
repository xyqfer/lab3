const os = require('os');

module.exports = (req, res) => {
    res.json({
        success: true,
        data: {
            arch: os.arch(),
            platform: os.platform(),
            release: os.release(),
            type: os.type(),
            cpus: os.cpus(),
            LEANCLOUD_AVAILABLE_CPUS: process.env.LEANCLOUD_AVAILABLE_CPUS,
            endianness: os.endianness(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            homedir: os.homedir(),
            tmpdir: os.tmpdir(),
            hostname: os.hostname(),
            loadavg: os.loadavg(),
            uptime: os.uptime(),
            networkInterfaces: os.networkInterfaces(),
        },
    });
};