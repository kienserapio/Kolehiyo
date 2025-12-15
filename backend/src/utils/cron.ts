import cron from 'node-cron';

/**
 * Ping function to keep Render server alive
 * Prevents the free tier from sleeping after 15 minutes of inactivity
 */
const pingServer = async (): Promise<void> => {
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${serverUrl}/healthz`);
    
    if (response.ok) {
      console.log(`[${new Date().toISOString()}] 🏓 Server ping successful - Status: ${response.status}`);
    } else {
      console.warn(`[${new Date().toISOString()}] ⚠️ Server ping returned status: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] ❌ Server ping failed:`, error?.message || error);
  }
};

/**
 * Start cron job to ping server every 14 minutes
 * Keeps Render free tier active and prevents cold starts
 */
export const startCron = (): void => {
  // Schedule: Every 14 minutes (Render sleeps after 15 min of inactivity)
  cron.schedule('*/14 * * * *', () => {
    console.log('⏰ Running scheduled server ping...');
    pingServer();
  });
  
  console.log('✅ Cron job started - Server will be pinged every 14 minutes');
  console.log('🔄 This keeps your Render server active and prevents cold starts');
  
  // Initial ping on startup (after 5 seconds to let server fully initialize)
  setTimeout(() => {
    console.log('🚀 Running initial server ping...');
    pingServer();
  }, 5000);
};

export { pingServer };
