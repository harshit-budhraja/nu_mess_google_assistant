const Service = require('./service');
const logPrefix = 'Logs from api: ';


const menu = async (req, res) => {
    const functionTag = 'menu: ';
    try {
        const { id } = req.query;
        if (!id) return res.status(422).send({ status: 422, message: `Missing mandatory paramter id in query.` });
    
        const svc = new Service();
        const menu = await svc.getMenu(id);
        if (!menu) return res.status(404).send({ status: 404, message: `Menu not found for id: ${id}` });
        return res.status(200).send(menu);
    } catch (error) {
        console.log(`${logPrefix}: ${functionTag}: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
        return res.status(500).send({status: 500, message: JSON.stringify(error, Object.getOwnPropertyNames(error)) });
    }
}

const health = async (req, res) => {
    const functionTag = 'health: ';
    try {
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
    } catch (error) {
        console.log(`${logPrefix}: ${functionTag}: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
        return res.status(500).send({status: 500, message: JSON.stringify(error, Object.getOwnPropertyNames(error)) });
    }
}

const ga_webhook = async (req, res) => {
    const functionTag = 'ga_webhook: ';
    try {
        const date = req.body.queryResult.parameters.date;
        const meal = req.body.queryResult.parameters.meal;
    
        const DEFAULT_ERROR_RESPONSES = global.config.webhook_responses;
    
        if (!date) {
            const availableResponses = DEFAULT_ERROR_RESPONSES.DATE_PARAM_404_RES;
            const randomResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
            return res.status(200).send({
                fulfillmentText: randomResponse
            });
        }
    
        if (!meal) {
            const availableResponses = DEFAULT_ERROR_RESPONSES.MEAL_PARAM_404_RES;
            const randomResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
            return res.status(200).send({
                fulfillmentText: randomResponse
            });
        }
    
        const svc = new Service();
        let response = await svc.getFulfillmentResponse(date, meal);
        if (!response) {
            const availableResponses = DEFAULT_ERROR_RESPONSES.MENU_ERROR_RES;
            response = availableResponses[Math.floor(Math.random() * availableResponses.length)];
        }
        return res.status(200).send({
            fulfillmentText: response
        });
    } catch (error) {
        console.log(`${logPrefix}: ${functionTag}: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
        return res.status(500).send({status: 500, message: JSON.stringify(error, Object.getOwnPropertyNames(error)) });
    }
}

module.exports = { menu, health, ga_webhook };