const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cohere = require('cohere-ai');

const app = express();
app.use(express.json());
app.use(cors());
cohere.init('0QiklQkgmpZUHujn12WTmXeqdTD5kdjiN400jrNB');

app.get('/', async (req, res) => {
  try {
    const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
      { expires_in: 3600 }, // can set a TTL timer in seconds.
      { headers: { authorization: '459f0cb64fc7430e958e6ec7778417bc' } }); // AssemblyAI API Key goes here
    const { data } = response;
    res.json(data);
  } catch (error) {
    const {response: {status, data}} = error;
    res.status(status).json(data);
  }
});

app.get('/api', async (req, res) => {
  const response = await cohere.classify(
    model='medium',
    taskDescription='The following is a sentiment classifier regarding customer orders for an e-commerce company',
    outputIndicator='this is:',
    inputs=["This item was broken when it arrived"],
    examples=[Example("The order came 5 days early", "positive"), Example("The item exceeded my expectations", "positive"), Example("I ordered more for my friends", "positive"), Example("I would buy this again", "positive"), Example("I would recommend this to others", "positive"), Example("The package was damaged", "negative"), Example("The order is 5 days late", "negative"), Example("The order was incorrect", "negative"), Example("I want to return my item", "negative"), Example("The item\'s material feels low quality", "negative")]
  )
  res.json(response.body);
});

app.set('port', 8000);
const server = app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${server.address().port}`);
});