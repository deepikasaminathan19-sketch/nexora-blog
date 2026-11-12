import 'dotenv/config';
import cron from 'node-cron';
import app from './app.js';
import connectDB from './config/db.js';
import { Blog } from './models/index.js';
await connectDB();
// Scheduled publishing: every minute, flip due "scheduled" posts to "published".
cron.schedule('* * * * *', async () => {
  const r = await Blog.updateMany({ status: 'scheduled', publishedAt: { $lte: new Date() } }, { status: 'published' });
  if (r.modifiedCount) console.log(`Published ${r.modifiedCount} scheduled post(s)`);
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on port ${port}`));
