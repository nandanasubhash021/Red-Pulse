const app = require('./server');

// Fire up Server Listener only if we are running locally (not in a serverless environment like Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running smoothly on port ${PORT}`);
  });
}

module.exports = app;