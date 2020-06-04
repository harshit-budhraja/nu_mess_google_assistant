const cache = {}, config = {};
global.cache = cache;
global.config = config;
const express = require("express");
const http = require('http');
const fs = require('fs');
const apiFunctions = require('./api');
const NodeCache = require("node-cache");

const initApp = async () => {
    const functionTag = 'initApp';
    console.log(`${functionTag}: Booting up the app`);
    try {
        const config = JSON.parse(fs.readFileSync('config.json'));
        if (config) console.log(`${functionTag}: Configurations loaded successfully from config.json`);
        global.config = config;
        const expressPort = config.express.port;
        if (!expressPort) throw new Error(`Cannot boot the app due to unspecified port`);

        /**
         * Associate functions with the router
         */
        const functions = Object.keys(apiFunctions);
        if (!functions || !(functions.length > 0)) throw new Error(`Unable to associate api routes with functions`);

        global.cache = new NodeCache(config.cache);
        console.log(`${functionTag}: Initialised Cache Service`);

        const app = express();

        config.routes.forEach(r => {
            if (!r.method) throw new Error(`Undefined HTTP Method for routing: ${JSON.stringify(r)}`);
            if (!r.route) throw new Error(`Undefined route for routing: ${JSON.stringify(r)}`);
            if (!r.function) throw new Error(`Undefined function mapping for routing: ${JSON.stringify(r)}`);
            switch (r.method) {
                case "GET":
                    app.get(r.route, apiFunctions[r.function]);
                    break;
                case "POST":
                    app.post(r.route, apiFunctions[r.function]);
                    break;
                default:
                    throw new Error(`Unimplemented HTTP method (${r.method}) encountered`);
            }
            console.log(`${functionTag}: Binding route [${r.method} ${r.route}] with function: ${r.function}`);
        });
        let server = http.createServer(app).listen(expressPort, () => {
            console.log(`${functionTag}: Api Initialised on port ${expressPort}`);
        });
        server.setTimeout(3600);
    } catch (error) {
        console.log(`${functionTag}: An unexpected error occured - ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    }
};

initApp();