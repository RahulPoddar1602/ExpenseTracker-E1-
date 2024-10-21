import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [balance, setBalance] = useState(0);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/home',{withCredentials:true});
                setBalance(response.data.balance);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/login')
            }
        };

        fetchData();
    }, []);

        const handleLogout = async () => {
            try {
                await axios.post('http://localhost:5000/api/logout',{},{withCredentials:true});
                navigate('/login');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        };

    return (
        <div>
            <h1>Welcome, {username}</h1>
            <h2>Your Balance: {balance}</h2>
            <button onClick={() => navigate('/income')}>Add Income</button>
            <button onClick={() => navigate('/expense')}>Add Expense</button>
            <button onClick={() => navigate('/transactions')}>View Transactions</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default HomePage;
