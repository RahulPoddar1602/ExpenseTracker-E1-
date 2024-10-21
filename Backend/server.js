const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true 
}));



mongoose.connect('mongodb+srv://aifamsmax:54utKg43xY1De33o@cluster0.nj4f2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{console.log("db connected")})
.catch((e)=>console.log(e));

const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' });
        req.user = decoded;
        next();
    });
};

const recalculateUserBalance = async (userId) => {
    try {
        const transactions = await Transaction.find({ userId });
        let balance = 0;
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                balance += transaction.amount;
            } else if (transaction.type === 'expense') {
                balance -= transaction.amount;
            }
        });

        const user = await User.findById(userId);
        user.balance = balance;
        await user.save();
    } catch (error) {
        console.error('Error recalculating balance:', error);
    }
};

app.post('/api/createUser', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, 'secret');
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', token });
});

app.get('/api/home', authenticate, async (req, res) => {
    const user = await User.findById(req.user.userId);
    await recalculateUserBalance(req.user.userId);
    res.status(200).json({ username: req.user.username, balance: user.balance });
});

app.post('/api/income', authenticate, async (req, res) => {
    const { title, amount } = req.body;
    const transaction = new Transaction({ title, amount, type: 'income', userId: req.user.userId });
    await transaction.save();

    await recalculateUserBalance(req.user.userId);
    res.status(201).json({ message: 'Income added successfully', transaction });
});

app.post('/api/expense', authenticate, async (req, res) => {
    const { title, amount } = req.body;
    const transaction = new Transaction({ title, amount, type: 'expense', userId: req.user.userId });
    await transaction.save();

    await recalculateUserBalance(req.user.userId);
    res.status(201).json({ message: 'Expense added successfully', transaction });
});

app.get('/api/transactions', authenticate, async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ transactions });
});

app.get('/api/transactions/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);
        if (!transaction || transaction.userId.toString() !== req.user.userId) {
            return res.status(403).send('Unauthorized');
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transaction' });
    }
});

app.put('/api/transaction/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, amount } = req.body;

    let transaction = await Transaction.findById(id);
    if (!transaction || transaction.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    transaction.title = title;
    transaction.amount = amount;
    await transaction.save();

    await recalculateUserBalance(req.user.userId);
    res.status(200).json({ message: 'Transaction updated successfully', transaction });
});

app.delete('/api/transaction/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction || transaction.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    await Transaction.findByIdAndDelete(id);
    await recalculateUserBalance(req.user.userId);
    res.status(200).json({ message: 'Transaction deleted successfully' });
});

app.post('/api/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true,  sameSite: 'Strict' , expires: new Date(0)});
    res.status(200).json({ message: 'Logout successful' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
