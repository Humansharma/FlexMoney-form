import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    selectedBatch: '',
  });

  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch request to enroll in classes
      const response = await fetch('http://localhost:3001/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      if (result.success) {
        // Simulate the payment process
        const paymentResult = await completePayment(result.user);

        // Set payment status based on the payment response
        if (paymentResult.success) {
          setPaymentStatus('Enrollment successful. Payment successful.');
        } else {
          setPaymentStatus('Enrollment successful. Payment failed.');
        }
      } else {
        setPaymentStatus('Enrollment failed.');
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
      setPaymentStatus('Enrollment failed.');
    }
  };

   // Mock function for payment processing
   const completePayment = async (user) => {
    // In a real application, you would make a call to the backend or a payment gateway
    // to process the payment. For simplicity, we simulate a successful payment here.

    // Assume the backend has a similar endpoint for payment processing
    const paymentResponse = await fetch('http://localhost:3001/completePayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        amount: 500, // Assuming the monthly fee is 500 INR
      }),
    });

    if (!paymentResponse.ok) {
      throw new Error(`HTTP error! Status: ${paymentResponse.status}`);
    }

    return paymentResponse.json();
  };


  return (
    <div className="container">
      <h1>Yoga Classes Admission Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Date of Birth:
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Select Batch:
          <select name="selectedBatch" value={formData.selectedBatch} onChange={handleChange} required>
            <option value="" disabled>Select a batch</option>
            <option value="6-7AM">6-7AM</option>
            <option value="7-8AM">7-8AM</option>
            <option value="8-9AM">8-9AM</option>
            <option value="5-6PM">5-6PM</option>
          </select>
        </label>
        <br />
        <button type="submit">Enroll</button>
      </form>

      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
}

export default App;
