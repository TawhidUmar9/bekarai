const axios = require('axios');

const { execFile } = require('child_process');
const path = require('path');

exports.printToTerm = async (req, res) => {

  const args = [
    path.join(__dirname, '../test.py'),
  ];

  execFile('python3', args, (error, stdout, stderr) => {
    if (error) {
      console.error('Python exec error:', error);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.error('Python stderr:', stderr);
    }

    // 1) Print to your server terminal
    console.log('Python output:', stdout);

    // 2) Return to the client
    res.status(200).json({
      message: 'Python script executed successfully',
      output: stdout.trim()
    });
  });
};