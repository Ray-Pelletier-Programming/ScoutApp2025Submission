//https://neon.tech/guides/local-development-with-neon
import { drizzle as drizzleWs } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { neon, neonConfig, Pool } from '@neondatabase/serverless';
import {
  isLocalDev,
  dbConnString,
  neonProxyHost,
  isPublicCloud,
} from '@/util/envHelper';
import ws from 'ws';

const connectionString = dbConnString;

// Configuring Neon for local development
if (isLocalDev) {
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] =
      host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
    return `${protocol}://${neonProxyHost}:${port}/sql`;
  };
  const connectionStringUrl = new URL(connectionString);
  neonConfig.useSecureWebSocket =
    connectionStringUrl.hostname !== 'db.localtest.me';
  neonConfig.wsProxy = (host) =>
    host === 'db.localtest.me'
      ? `${neonProxyHost}:4444/v2`
      : `${neonProxyHost}/v2`;
  //neonConfig.useSecureWebSocket = false;
  //neonConfig.pipelineTLS = false;
  //neonConfig.pipelineConnect = false;
} else {
  neonConfig.webSocketConstructor = WebSocket;
  neonConfig.poolQueryViaFetch = true;
}
neonConfig.webSocketConstructor = ws;

const sql = neon(connectionString);
const pool = new Pool({ connectionString });

// Neon supports both HTTP and WebSocket clients. Choose the one that fits your needs:
// HTTP Client (sql)
// - Best for serverless functions and Lambda environments
// - Ideal for stateless operations and quick queries
// - Lower overhead for single queries
// - Better for applications with sporadic database access
export const drizzleClientHttp = drizzleHttp({
  client: sql,
  logger: !isPublicCloud,
});

// WebSocket Client:
// - Best for long-running applications (like servers)
// - Maintains a persistent connection
// - More efficient for multiple sequential queries
// - Better for high-frequency database operations
export const drizzleClientWs = drizzleWs({
  client: pool,
  logger: !isPublicCloud,
});
