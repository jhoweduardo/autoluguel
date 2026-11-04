import SwaggerParser from '@apidevtools/swagger-parser';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const contractPath = process.argv[2]
  ? resolve(process.argv[2])
  : fileURLToPath(new URL('../../docs/api/openapi.json', import.meta.url));

try {
  const contract = await SwaggerParser.validate(contractPath, {
    resolve: { http: false },
  });
  console.log(`OpenAPI ${contract.openapi} schema and references are valid.`);
} catch (error) {
  console.error('OpenAPI validation failed:', error.message);
  process.exitCode = 1;
}
