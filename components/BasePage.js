import { Container } from 'reactstrap';
import Head from 'next/head';

const BasePage = ({ className, children }) => (
  <div className={`base-page ${className}`}>
    <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.9.0/devicon.min.css" />
    </Head>
    <Container>
      {children}
    </Container>
  </div>
);

export default BasePage;
