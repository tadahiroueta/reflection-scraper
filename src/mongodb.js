const { MongoClient } = require("mongodb");

const uri = require("../data/mongoURI.json")

const DATABASE = require("../data/database-name.json")


/**
 * Overwrites collection (JSON file) with new data
 * 
 * @param {String} collection "availability" or "thumbnails"
 * @param {Object} update { name: data }
 */
const upload = async (collection, update) => {

    const client = new MongoClient(uri);
    try { 
        await client.db(DATABASE).collection(collection)
            .bulkWrite(
                Object.entries(update).map(([name, data]) => ({
                    updateOne: {
                        filter: { name },
                        update: { $set: { name, data } },
                        upsert: true
    }})))}
    finally { await client.close() } // no matter what
}

// for older versions of node, I guess
module.exports = upload