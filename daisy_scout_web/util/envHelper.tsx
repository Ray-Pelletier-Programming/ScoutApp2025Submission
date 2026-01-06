const {
  POSTGRES_HOST,
  POSTGRES_HOST_PROD,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  NEON_PROXY_HOST,
  IS_PUBLIC_CLOUD,
  CLOUD_PREVIEW,
} = process.env;

const isProduction = process.env.DB_ENV?.toLocaleLowerCase() === 'production';
const isPreview = process.env.DB_ENV?.toLocaleLowerCase() === 'preview';
const isLocalDrizzle = process.env.DB_ENV?.toLocaleLowerCase() === 'local';
export const isLocalDev =
  process.env.DB_ENV === 'development' || process.env.DB_ENV === undefined;

console.log('Database Environment', process.env.DB_ENV);

// not sure why container name does not work here...
// dbmigrate requires container name...
let connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db.localtest.me:5432/${POSTGRES_DB}`;
if (isPreview) {
  connectionString = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/${POSTGRES_DB}?sslmode=require`;
} else if (isProduction) {
  connectionString = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST_PROD}/${POSTGRES_DB}?sslmode=require`;
} else if (isLocalDrizzle) {
  connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db.localtest.me:5435/${POSTGRES_DB}`;
}
console.log('envhelper: ', connectionString);

export const dbConnString = connectionString;
export const neonProxyHost = NEON_PROXY_HOST ?? 'db.localtest.me';
export const isPublicCloud = IS_PUBLIC_CLOUD?.toUpperCase() === 'TRUE';
export const isCloudPreview = CLOUD_PREVIEW?.toUpperCase() === 'TRUE';
export const dataSyncMode = isPublicCloud
  ? 'fms'
  : isCloudPreview
    ? 'preview'
    : 'production';
