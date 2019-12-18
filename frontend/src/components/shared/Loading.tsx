import { Icon, Spin } from 'antd';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <>
      <Spin size="large" indicator={<Icon type="loading" />} />
    </>
  );
};

export default Loading;
