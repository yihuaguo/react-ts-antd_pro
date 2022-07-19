import { LoginOutlined, UserOutlined } from '@ant-design/icons'
import styles from './index.less'
import React from 'react'
import { Dropdown, Menu } from 'antd'
import { history, useModel } from '@umijs/max'
import storage from '@/utils/storage'
import { notification } from '@/utils/utils'

const HeaderUser: React.FC = () => {

    const { initialState, setInitialState } = useModel('@@initialState');
    const { img, name } = initialState?.userInfo || {}

    const logout = () => {
        // 后端登出接口.......
        setInitialState({ ...initialState, userInfo: undefined })
        storage.localRemove('userInfo')
        notification('success', '注销成功！')
        history.push('/login')
    }

    const menu = <Menu
        items={[
            {
                key: '1',
                icon: <UserOutlined />,
                label: (
                    <a rel="noopener noreferrer">
                        个人中心
                    </a>
                ),
            },
            {
                type: 'divider',
            },
            {
                key: '2',
                icon: <LoginOutlined />,
                label: (
                    <a rel="noopener noreferrer" onClick={logout}>
                        注销
                    </a>
                ),
            },
        ]}
    />

    return <Dropdown
        overlay={menu}
        placement="bottomRight"
        arrow
    >
        <div className={styles.headerUser}>
            {name}
            <img src={img || ''} className={styles.avatar} />
        </div>
    </Dropdown>
}

export default HeaderUser