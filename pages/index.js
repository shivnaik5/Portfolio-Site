import React from 'react';
import BaseLayout from '@/components/layouts/BaseLayout';
import Home from '@/components/home/Home';

const Index = () => (
  <BaseLayout className='cover'>
    <div className='main-section'>
      <Home />
    </div>
  </BaseLayout>
);

export default Index;
