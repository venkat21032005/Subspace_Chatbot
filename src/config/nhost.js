import { NhostClient } from '@nhost/nhost-js';

export const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || 'demo-subdomain',
  region: process.env.REACT_APP_NHOST_REGION || 'us-east-1',
});