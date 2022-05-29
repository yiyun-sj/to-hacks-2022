const express = require('express')
const axios = require('axios')
const cors = require('cors')
const cohere = require('cohere-ai')

const app = express()
app.use(express.json())
app.use(cors())
cohere.init('0QiklQkgmpZUHujn12WTmXeqdTD5kdjiN400jrNB')

app.get('/', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
      { expires_in: 3600 }, // can set a TTL timer in seconds.
      { headers: { authorization: '459f0cb64fc7430e958e6ec7778417bc' } }
    ) // AssemblyAI API Key goes here
    const { data } = response
    res.json(data)
  } catch (error) {
    const {
      response: { status, data },
    } = error
    res.status(status).json(data)
  }
})

app.post('/cohere', async (req, res) => {
  const response = await cohere.classify('medium', {
    inputs: req.body.sentences,
    examples: [{"text": "love this movie", "label": "positive review"}, {"text": "I would not recommend this movie to my friends", "label": "negative review"}, {"text": "I did not want to finish the movie", "label": "negative review"}, {"text": "I would watch this movie again with my friends", "label": "positive review"}, {"text": "hate this movie", "label": "negative review"}, {"text": "this movie lacked any originality or depth", "label": "neutral review"}, {"text": "we made it only a quarter way through before we stopped", "label": "negative review"}, {"text": "this movie was okay", "label": "neutral review"}, {"text": "this movie was neither amazing or terrible", "label": "neutral review"}, {"text": "I would not watch this movie again but it was not a waste of time", "label": "neutral review"}, {"text": "I would watch this movie again", "label": "positive review"}, {"text": "i liked this movie", "label": "positive review"}, {"text": "this movie was nothing special", "label": "neutral review"}, {"text": "this is my favourite movie", "label": "positive review"}, {"text": "worst movie of all time", "label": "negative review"}]
  });
  console.log(`The confidence levels of the labels are ${response.body.classifications}`);
  res.json(response.body.classifications)
})

app.set('port', 8000)
const server = app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${server.address().port}`)
})
