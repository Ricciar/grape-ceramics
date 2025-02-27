import app from './app.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const port = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
