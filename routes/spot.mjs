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
    },
    "/:id": {
        "get": (async (req, res) => {
            const _id = _.get(req, 'params.id');
            if (!_id) {
                return resError(res, 400, 'id is missing.');
            }
            try {
                const spot = await db.getSpot(_id);
                console.log('Success', spot);
                return res.send(spot).status(200);

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