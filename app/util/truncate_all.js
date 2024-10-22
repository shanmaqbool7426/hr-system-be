const mongoose = require('mongoose');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Get all collections
        mongoose.connection.db.listCollections().toArray()
            .then(collections => {
                collections.forEach(collection => {
                    mongoose.connection.db.dropCollection(collection.name)
                        .then(() => {
                            console.log(`Dropped collection: ${collection.name}`);
                        })
                        .catch(err => {
                            console.error(`Error dropping collection ${collection.name}:`, err);
                        });
                });
            })
            .catch(err => {
                console.error('Error listing collections:', err);
            });
    })
    .catch(err => {
        console.error('Connection error:', err);
    });
