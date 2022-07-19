import { InsuranceOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Card, Col, message, Row, Spin } from 'antd';
import React from 'react';
import styles from './index.less';
import { captcha, login } from '@/services/login'
import { history, useModel } from '@umijs/max';
import { useBoolean, useMount, useSetState } from 'ahooks'
import storage from '@/utils/storage';
import { notification } from '@/utils/utils';

interface CaptchaValues {
  code: string,
  code_key: string
}

const initCaptchaValues: CaptchaValues = {
  code: '',
  code_key: ''
}

const Login: React.FC = () => {

  const [loading, { setTrue, setFalse }] = useBoolean(true);
  const [captchaValues, setCaptchaValues] = useSetState<CaptchaValues>(initCaptchaValues)
  const { initialState, setInitialState } = useModel('@@initialState');

  useMount(() => { getCaptcha() })

  const getCaptcha = async () => {
    setTrue()
    captcha().then(res => {
      setCaptchaValues(res)
    }).catch(() => {
      message.error('验证码刷新失败！请重试！')
    }).finally(() => {
      setFalse()
    })
  }

  const setCurrentUser = async (userInfo: any) => {
    setInitialState({
      ...initialState,
      userInfo
    })
    storage.localSet('userInfo', userInfo)
    notification('success', '登录成功！')
  }

  const handleSubmit = async (values: any) => {
    const params = {
      code_key: captchaValues.code_key,
      ...values
    }
    setTrue()
    login(params).then(async (res: { access_token: string }) => {
      const token = res.access_token
      // 登录接口......
      const userInfo = {
        name: '张三',
        img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660724652&t=39f021e7459ed61db27fe568db08e4f4',
        token: token
      }
      await setCurrentUser(userInfo)
      history.push('/')
    }).catch(err => {
      message.error(err)
    }).finally(() => {
      setFalse()
    })
  };

  return (
    <div className={styles.container}>
      <Card className={styles.logoBox}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="登录标题"
          subTitle='登录描述'
          onFinish={handleSubmit}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder='密码'
            rules={[
              {
                required: true,
                message: '请输入密码！'
              },
            ]}
          />
          <Row justify='space-between'>
            <Col span={15}>
              <ProFormText
                name="captcha"
                fieldProps={{
                  size: 'large',
                  prefix: <InsuranceOutlined />,
                }}
                placeholder={'请输入验证码'}
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
              />
            </Col>
            <Col span={8}>
              <Spin spinning={loading}>
                <img src={captchaValues.code} alt='验证码' className={styles.captcha} onClick={getCaptcha} />
              </Spin>
            </Col>
          </Row>
        </LoginForm>
      </Card>
    </div>
  );
};

export default Login;
