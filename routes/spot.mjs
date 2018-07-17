import _ from 'lodash';
import express from 'express';
import { resError } from './util.mjs';
import db from '../db.mjs';

const routers = {
    "/search": {
        "post": (async (req, res) => {
            const type = _.get(req, 'body.type');
            if (!type) {
                return resError(res, 400, 'type is missing.');
            }
            try {
                const spots = await db.searchSpot(type);
                console.log('Success', spots);
                return res.send(spots).status(200);
                

            } catch (e) {
                return resError(res, 500, e, type);
            }
        })
    }
}

export default function (resource, app) {
    const router = express.Router();
    _.forEach(routers, (apis, verb) => _.forEach(apis, (func, method) => router[method](verb, func)));
    app.use(resource, router);
    console.log('Listen', _.flatMap(routers, (apis, verb) => `${_.keys(apis).join("/")} ${resource}${verb}`));
}