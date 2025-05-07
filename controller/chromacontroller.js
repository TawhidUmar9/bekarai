const axios = require('axios');
const { execFile } = require('child_process');
const path = require('path');

exports.printToTerm = async (req, res) => {
    const { action, email, user_id, prompt } = req.body;
    const scriptPath = path.join(__dirname, '../rag.py');
    
    // Build the args based on the action
    let args = [scriptPath, action];
    if (action === 'gen_user_string' || action === 'add_user_to_chromadb') {
        args.push(email);
    } else if (action === 'test_recommendation' || action === 'test_job_recommendation') {
        args.push(user_id, prompt);
    }

    execFile('python', args, (error, stdout, stderr) => {
        if (error) {
            console.error('Python exec error:', error);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error('Python stderr:', stderr);
        }

        // Print to server terminal
        console.log('Python output:', stdout);

        // Return to the client
        res.status(200).json({
            message: 'Python script executed successfully',
            output: stdout.trim()
        });
    });
};
