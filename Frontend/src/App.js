import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import IncomePage from './components/IncomePage';
import ExpensePage from './components/ExpensePage';
import TransactionsPage from './components/TransactionsPage';
import TransactionEditPage from './components/TransactionEditPage';
import CreateUserPage from './components/CreateUserPage';  // Added CreateUserPage

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/income" element={<IncomePage />} />
                <Route path="/expense" element={<ExpensePage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/edit/:id" element={<TransactionEditPage />} />
                <Route path="/createUser" element={<CreateUserPage />} />  {/* New route */}
            </Routes>
        </Router>
    );
}

export default App;
