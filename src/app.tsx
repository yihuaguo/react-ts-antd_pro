import { LinkOutlined } from '@ant-design/icons';
import { SettingDrawer } from '@ant-design/pro-components';
import { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import HeaderUser from './components/layout_components/HeaderUser';
import storage from './utils/storage';
import { notification } from './utils/utils';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

// 初始化网站
export async function getInitialState(): Promise<any> {
  const currentPath = history.location.pathname || ''
  const globalData = {
    settings: defaultSettings,
  }
  // 不是登录页面则进行用户是否登录判断
  if (currentPath !== loginPath) {
    const storageUserInfo = storage.localGet('userInfo')
    if (storageUserInfo) {
      // 建议后端提供用户是否登录接口来进行更加准确的判断......
      return {
        userInfo: storageUserInfo,
        ...globalData
      }
    } else {
      notification('error', '用户没有登录，请进行登录操作！')
      history.push(loginPath)
    }
  }
  return globalData
}

// 全局请求处理
export const request: RequestConfig = {
  errorConfig: {
    errorHandler: (error: any) => {
      const { response, message } = error
      const status = (response?.status) + ''
      notification('error', `网络错误，错误码：${status}！`, message)
    }
  },
  requestInterceptors: [
    (request: any) => {
      const url = request.url
      if (url === '/admin/auth/verification_code' || url === '/admin/auth/login') {
        return request
      } else {
        const storageUserInfo = storage.localGet('userInfo')
        if (storageUserInfo) {
          return {
            ...request,
            headers: {
              Authorization: `Bearer ${storage.localGet('userInfo')?.['token'] || ''}`
            }
          }
        } else {
          history.push('/login')
          notification('error', '登录信息校验失败，请重新登录！')
          return
        }
      }

    },
  ],
  responseInterceptors: [
    (response: any) => {
      const statusCode = response.status + ''
      const startCode = statusCode.substring(0, 1)
      if (startCode === '2' || startCode === '3') {
        return response;
      } else {
        notification('error', `异常请求，异常码：${statusCode}！`)
        return new Error('err')
      }
    },
  ],
};

// 全局layout处理
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }: any) => {
  return {
    rightContentRender: () => <HeaderUser />,
    disableContentMargin: false,
    waterMarkProps: {
      content: '水印'
    },
    footerRender: () => <></>,
    // 路由切换
    onPageChange: () => { },
    links: [<Link key="document" to="/umi/plugin/openapi" target="_blank">
      <LinkOutlined />
      <span>左下角文档</span>
    </Link>],
    menuHeaderRender: (logo, title) => { },
    // 403页面
    unAccessible: <div>un-Accessible</div>,
    // 内容页面layout
    childrenRender: (children, props) => {
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
