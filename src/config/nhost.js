import { NhostClient } from '@nhost/nhost-js';

export const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || 'demo-subdomain',
  region: process.env.REACT_APP_NHOST_REGION || 'us-east-1',
  graphqlUrl: process.env.REACT_APP_HASURA_GRAPHQL_URL,
});