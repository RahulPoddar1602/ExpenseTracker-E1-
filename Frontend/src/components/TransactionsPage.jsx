// export default TransactionsPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/transactions', { withCredentials: true });
                setTransactions(response.data.transactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/transaction/${id}`, { withCredentials: true });
            setTransactions(transactions.filter((transaction) => transaction._id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            navigate('/login')
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div>
            <h1>Your Transactions</h1>
            <ul>
                {transactions.map((transaction) => (
                    <li
                        key={transaction._id}
                        style={{
                            color: transaction.type === 'income' ? 'green' : 'red',  
                        }}
                    >
                        <strong>{transaction.title}</strong> - {transaction.amount} ({transaction.type})
                        <br />
                        <small>{formatDateTime(transaction.createdAt)}</small> 
                        <br />
                        <button onClick={() => handleEdit(transaction._id)}>Edit</button>
                        <button onClick={() => handleDelete(transaction._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TransactionsPage;
