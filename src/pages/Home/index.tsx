import { PageContainer } from '@ant-design/pro-components';
import { Alert } from 'antd';
import React from 'react';

const Home: React.FC = () => {

    return (
        <PageContainer>
            <Alert
                message='欢迎页面！'
                type="success"
            />
        </PageContainer>
    );
};

export default Home;
