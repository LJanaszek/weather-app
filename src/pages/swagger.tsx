import dynamic from 'next/dynamic';
import { GetStaticProps } from 'next';
import { OpenAPIObject } from 'openapi3-ts/oas30'; 


const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

interface Props {
  spec: OpenAPIObject;
}

export default function SwaggerPage({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('http://localhost:3000/api/swagger');
  const spec = await res.json();

  return {
    props: {
      spec,
    },
  };
};
