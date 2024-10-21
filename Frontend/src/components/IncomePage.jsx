import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function IncomePage() {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/income', { title, amount },{withCredentials:true});
            navigate('/home');
        } catch (error) {
            console.error('Error adding income:', error);
            navigate('/login')
        }
    };

    return (
        <div>
            <h1>Add Income</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
                <button type="submit">Add Income</button>
            </form>
        </div>
    );
}

export default IncomePage;
