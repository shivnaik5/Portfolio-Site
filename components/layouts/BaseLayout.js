import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Head from 'next/head';

const BaseLayout = ({ children, className }) => {
  return (
    <div className="layout-container">
      <Head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.9.0/devicon.min.css" />
      </Head>
      <Header />
      <main className={`cover ${className}`}>
        <div className="wrapper">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BaseLayout;
