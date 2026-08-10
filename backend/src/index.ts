import { createApp } from './server';
import { prisma } from './prisma/client';

const PORT = process.env.PORT || 5000;
const app = createApp();

const startServer = async () => {
  try {
    // Test database connectivity
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected successfully via Prisma');

    app.listen(PORT, () => {
      console.log(`🚀 Adama Support Backend server listening on http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔑 API Base Endpoint: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
