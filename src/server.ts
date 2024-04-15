import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}!`);
});
