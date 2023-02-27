const { MongoClient } = require("mongodb");

const uri = require("./data/mongoURI.json")

const DATABASE = "reflection-database"


/**
 * Overwrites collection (JSON file) with new data
 * 
 * @param {String} collection "availability" or "thumbnails"
 * @param {Object} update { name: data }
 */
export default async (collection, update) => {

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
