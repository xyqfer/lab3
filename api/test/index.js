const { getData } = require('@xyqfer/leancloud-db');

module.exports = async (req, res) => {
    res.json(await getData({
        dbName: 'Test',
    }));
};