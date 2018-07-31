import config from './config/local.mjs';
import mongodb from 'mongodb';
import _ from 'lodash';
const MongoClient = mongodb.MongoClient;

class DB {
    async connect() {
        const connection = `mongodb+srv://${config.mongodb.username}:${config.mongodb.password}@cluster0-zcgfb.gcp.mongodb.net/test?retryWrites=true`;
        console.log(`Connecting to DB.. ${connection}`);

        this.client = await MongoClient.connect(connection, { useNewUrlParser: true });
        this.db = this.client.db('spa');
        console.log('db open');
    }

    async searchSpot(type) {
        try {
            const result = await this.db.collection('service').aggregate([
                { $match: { type } },
                { $group: { _id: "$_spot", services: { $push: "$$ROOT" } } },
                { $lookup: { from: 'spot', localField: '_id', foreignField: '_id', as: 'spot' } },
                { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$spot", 0] }, "$$ROOT"] } } },
                { $project: { spot: 0, "services._id": 0, "services._spot": 0, "services.type": 0 } }
            ]);
            return result.toArray();

        } catch (e) {
            console.err(e);
        }
    }

    async getSpot(_id) {
        try {
            _id = mongodb.ObjectId(_id);
            const spot = await this.db.collection('spot').findOne({ _id });
            const servicesResult = await this.db.collection('service').find({ _spot: _id });
            const servicesArray = await servicesResult.toArray();
            const services = _.groupBy(servicesArray.map(({ length, price, currency, type }) => ({ length, price, currency, type })), 'type');
            return { ...spot, services };

        } catch (e) {
            console.err(e);
        }
    }
}

export default new DB();