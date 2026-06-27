import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import requestLogger from './middlewares/requestLogger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api', router);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
