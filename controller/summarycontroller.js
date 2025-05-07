const axios = require('axios');

exports.summarize = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'mistral',
            prompt: `Summarize the following text:\n\n${text}`,
            stream: false
        });

        const summary = response.data.response;

        if (!summary) {
            return res.status(500).json({ error: 'Failed to summarize text' });
        }

        return res.status(200).json({ summary });
    } catch (error) {
        console.error('Error summarizing text:', error.message);
        return res.status(500).json({ error: 'Failed to summarize text' });
    }
};
