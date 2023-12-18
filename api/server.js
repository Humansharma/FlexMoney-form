// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

// Mock database for user records
const users = [];

// REST API endpoint for the admission form
app.post('/enroll', (req, res) => {
  try {
    // Get user data from the request
    const { name, email, dob, selectedBatch } = req.body;

    // Age verification (assuming date of birth is in YYYY-MM-DD format)
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age < 18 || age > 65) {
      return res.status(400).json({ error: 'Age must be between 18 and 65 years.' });
    }

    // Add user to the database
    const user = { id: users.length + 1, name, email, dob, selectedBatch, paymentStatus: 'pending' };
    users.push(user);

    // Return success response
    res.json({ success: true, message: 'Enrollment successful.', user });
  } catch (error) {
    console.error('Error during enrollment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mock endpoint for payment processing
app.post('/completePayment', (req, res) => {
  try {
    // Simulate a successful payment
    const { userId, amount } = req.body;

    // In a real-world scenario, you would integrate with a payment gateway here
    // and update the user's payment status in the database.

    // For simplicity, we'll mark the payment as successful in this mock endpoint.
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update user's payment status in the database
    user.paymentStatus = 'paid';

    // Return success response
    res.json({ success: true, message: 'Payment successful.', user });
  } catch (error) {
    console.error('Error during payment processing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
