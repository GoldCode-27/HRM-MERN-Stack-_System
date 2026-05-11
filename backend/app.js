const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes');
const { scheduleDailyReport } = require('./src/utils/scheduler');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB().then(() => {
  scheduleDailyReport();
});

app.use('/api', apiRoutes);


app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'HRM backend is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on https://localhost:${PORT}`);
});
