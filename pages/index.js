import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Typed from 'react-typed';
import Link from 'next/link';
import BaseLayout from '@/components/layouts/BaseLayout';

import Home from '@/components/home/Home';

const Index = () => {


  return (
    <BaseLayout className='cover'>
      <div className='main-section'>
        <Home />
      </div>
    </BaseLayout>
  );
}

export default Index;
