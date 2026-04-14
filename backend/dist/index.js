import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Load environment variables
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'Backend running successfully' });
});
// Placeholder routes
app.post('/api/analyze', (req, res) => {
    res.json({ message: 'Analysis endpoint - coming soon' });
});
app.get('/api/charts', (req, res) => {
    res.json({ message: 'Charts endpoint - coming soon' });
});
// Start server
app.listen(PORT, () => {
    console.log(`✨ LiquidHub Backend running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
