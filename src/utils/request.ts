import { request as umi_request, history } from '@umijs/max';
import storage from './storage';
import { notification } from './utils';

const request: RequestUtil = async (method, url, params = {}, headers = {}, ...options) => {
    const response = await umi_request(url, {
        method,
        headers,
        params: params?.query,
        data: params?.body,
        ...options
    })
    const { code, data, msg } = response
    if (code === 401 || code === 1003) {
        storage.localRemove('userInfo')
        notification('warning', '登录信息已过期，请重新登录！')
        history.push('/login')
        return
    }
    if (code !== 200) {
        return Promise.reject(msg)
    }
    return data || {}
}

export default request