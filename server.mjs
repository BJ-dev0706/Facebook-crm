import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(bodyParser.json());

const affiliateToken = 'd04c5d47-f6ae-4cc9-bfce-9853f8ff077b';
const bearerToken = 'da10ad7a-e60c-4bc1-93d2-61a0262621df';

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Service is healthy' });
});

app.post('/submit-form', async (req, res) => {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
        return res.status(400).json({ error: 'Full name, email, and phone are required.' });
    }

    const [firstName, lastName] = fullName.split(' ');
    const fullPhoneNumber = phone;
    const data = {
        firstName,
        lastName,
        email,
        phone: fullPhoneNumber,
        description: "Mc realco",
        country: "Turkey",
        tags: ["sampleTag"],
    };

    try {
        const response = await fetch(`https://c73000-backend-clientzone.dataconect.com/api/v1/affiliate/token/lead?affiliateToken=${affiliateToken}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to submit data to the API');
        }

        const responseData = await response.json();
        res.status(200).json({ message: 'Data submitted successfully', data: responseData });
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).json({ error: 'Error submitting data' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
