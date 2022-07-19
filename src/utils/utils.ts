import { notification as antd_notification } from 'antd';

export const notification: NotificationUtil = (type = 'info', message = '', description = '') => {
    antd_notification[type]({
        message,
        description
    })
}

// 列表请求参数切换
export const listParamChange = (params: ListParams) => {
    const { current, pageSize, ...otherParams } = params
    return {
        page: current,
        size: pageSize,
        ...otherParams
    }
}

// 列表响应结果切换
export const listResultChange = (result: any = {}) => {
    const { list = [], count = 0 } = result
    return {
        data: list || [],
        total: count || 0,
        success: true
    }
}

export default {
    notification,
    listParamChange,
    listResultChange
}