import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function TransactionEditPage() {
    const { id } = useParams();
    const [title, setTitle] = useState(''); 
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransaction = async () => {
            console.log(id)
            try {
                const response = await axios.get(`http://localhost:5000/api/transactions/${id}`, { withCredentials: true });
                // console.log(response.data)
                const  transaction  = await response.data;
                console.log(transaction)
                setTitle(transaction.title);
                setAmount(transaction.amount);
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching transaction:', error);
                setLoading(false); 
                navigate('/login')
            }
        };

        fetchTransaction();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/transaction/${id}`, { title, amount }, { withCredentials: true });
            navigate('/transactions');
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <div>
            <h1>Edit Transaction</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}  
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <input
                    type="number"
                    value={amount}  
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    required
                />
                <button type="submit">Update Transaction</button>
            </form>
        </div>
    );
}

export default TransactionEditPage;
