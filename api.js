const Service = require('./service');

const menu = async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(422).send({ status: 422, message: `Missing mandatory paramter id in query.` });
    
    const svc = new Service();
    const menu = await svc.getMenu(id);
    return res.status(200).send(menu);
}

const health = async (req, res) => {
    const cacheStats = global.cache.getStats();
    res.status(200).send({
        api: {
            health: "Ok"
        },
        cache: {
            health: "Ok",
            stats: cacheStats
        }
    });
}

module.exports = { menu, health };