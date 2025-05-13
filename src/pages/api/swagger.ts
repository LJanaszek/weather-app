import type { NextApiRequest, NextApiResponse } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import { swaggerDocument } from '../../lib/swagger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    
  const spec = createSwaggerSpec({
    apiFolder: 'pages/api',
    definition: swaggerDocument as undefined,
  });

  res.status(200).json(spec);
}
