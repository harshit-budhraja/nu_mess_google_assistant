const axios = require('axios');
const moment = require('moment-timezone');

class Service {
    /**
     * Constructor for this service
     */
    constructor() {
        this.API_URL = 'https://nucleus.niituniversity.in/WebApp/StudParentDashBoard/MessMenu.aspx/GetMessMenuStudentPortal';
        this.permitted_menus = ["1", "2"];
        this.cache = global.cache;
    }

    /**
     * 
     * @param {String} messMenuTypeId 
     * 
     * Driver function that gets the menu from the node-cache
     * if available, or fetches from upstream.
     */
    async getMenu(messMenuTypeId) {
        const functionTag = 'getMenu';
        let menu = null;
        try {
            if (!messMenuTypeId) return null;
            if (!this.permitted_menus.includes(messMenuTypeId)) throw new Error(`Unexpected value ${messMenuTypeId} for messMenuTypeId`);
            const start = moment();
            menu = this.cache.get(messMenuTypeId);
            if (!menu) {
                console.log(`${Service.logPrefix}: ${functionTag}: Cache miss on messMenuTypeId = ${messMenuTypeId}`);
                let upstreamMenu = await this.fetchLatestMenuFromNucleus(messMenuTypeId);
                if (this.cache.set(messMenuTypeId, upstreamMenu)) console.log(`${Service.logPrefix}: ${functionTag}: Populated cache for messMenuTypeId = ${messMenuTypeId}`);
                return upstreamMenu;
            }
            console.log(`${Service.logPrefix}: ${functionTag}: Fetched menu for messMenuTypeId = ${messMenuTypeId} from cache in ${moment() - start} ms`);
            return menu;
        } catch (error) {
            console.log(`${Service.logPrefix}: ${functionTag}: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
            return null;
        }
    }

    /**
     * 
     * @param {String} messMenuTypeId 
     * A utility funtion to fetch the latest menu from
     * Nucleus and returned a structured JSON response.
     */
    async fetchLatestMenuFromNucleus(messMenuTypeId) {
        /**
         * 
         * @param {String} menuString
         * A utility function to parse the dirty string
         * returned by the Nucleus API into a structured
         * JSON response
         */
        const parseMenu = (menuString) => {
            const parsedMenu = {}, menu = [];
            menuString.split('$^').forEach(day => {
                const meals = [];
                day.split('$').forEach(meal => {
                    const items = [];
                    meal.split('\r\n').forEach(item => {
                        if (item) items.push(item.trim());
                    });
                    meals.push(items);
                });
                menu.push(meals);
            });

            const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
            const MEALS = ["breakfast", "lunch", "hi_tea", "dinner"];
            for (let i = 0; i < DAYS.length; i++) {
                let m = menu[i];
                const myMeals = {};
                for (let j = 0; j < MEALS.length; j++) {
                    myMeals[MEALS[j]] = m[j];
                }
                parsedMenu[DAYS[i]] = myMeals;
            }
            return parsedMenu;
        };

        const functionTag = 'fetchLatestMenuFromNucleus';
        let result = null;
        try {
            if (!messMenuTypeId) throw new Error(`No messMenuTypeId found.`);
            if (!this.permitted_menus.includes(messMenuTypeId)) throw new Error(`Unexpected value ${messMenuTypeId} for messMenuTypeId`);
            const start = moment();
            result = await axios.post(this.API_URL, { messMenuTypeId }, { headers: { "Content-Type": "application/json" } });
            const retval = parseMenu(result.data.d);
            console.log(`${Service.logPrefix}: ${functionTag}: Fetched and parsed latest menu from Nucleus in ${moment() - start} ms`);
            return retval;
        } catch (error) {
            console.log(`${Service.logPrefix}: ${functionTag}: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
            return null;
        }
    }
}

Service.logPrefix = 'Logs from Service';
module.exports = Service;