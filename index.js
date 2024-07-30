const express = require('express');
const axios = require('axios');
const cron = require('node-cron')
const fs = require('fs').promises;
const app = express();
const port = 80;

const uri = 'https://gnews.io/api/v4/top-headlines?max=5&apikey=cc2a98dbf82de6bd84bb767a224c6b75'
const langs = ['es', 'en', 'fr']
const categories = ['general', 'world', 'nation', 'technology', 'entertainment', 'sports']
const dbPath = './cache.json'
const apiKeyConfirm = '128648h'

let db = fs.readFile(dbPath, 'utf8')

async function refreshCache() {
    try {
        jsonData = []
        for (const lang in langs) {

            for (const category in categories) {
                const uri = `${uri}&lang=${lang}&category=${category}`
                const response = await axios.get(url)
                const responseData = response.data;

                const document = {
                    lang,
                    category,
                    data: responseData
                }

                jsonData.push(document);

                await new Promise(resolve => setTimeout(resolve, 1200));
            }
        }

        db = jsonDaya
        await fs.writeFile(dbPath, JSON.stringify(jsonData, null, 2), 'utf8')
    } catch (err) {
        console.error(err)
    }
}

cron.schedule('0 0 * * *', () => {
    console.log('Refreshing data...')
    refreshCache()
})

// Middleware to parse JSON bodies
app.use(express.json());

// Define a basic route
app.get('/', (req, res) => {
    const { lang, category } = req.query;

    if (!lang || !category) {
        return res.status(400).json({ error: 'Missing required query parameters: lang and category' });
    }

    const result = db.find(doc => doc.lang === lang && doc.category === category);

    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ message: 'Document not found' });
    }
});

app.post('/refresh', (req, res) => {
    const { apiKey } = req.query

    if (apiKey == apiKeyConfirm) {
        refreshCache()
        res.status(200).json({ message: 'Refreshing cache...' })
    } else {
        res.status(400).json({ message: 'Invaid API key' })
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
