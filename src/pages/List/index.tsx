import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Spin } from 'antd';
import { list } from '@/services/list'
import { useSetState, useBoolean } from 'ahooks'
import { useRef } from 'react';
import OptionModal from './OptionModal';

interface OptionModal {
    visible: boolean,
    id: string | undefined,
}

const initOptionModal: OptionModal = {
    visible: false,
    id: undefined,
}

export default () => {

    const actionRef = useRef<ActionType>();
    const [loading] = useBoolean(false);
    const [optionModal, setOptionModal] = useSetState<OptionModal>(initOptionModal)

    const columns: ProColumns[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            fixed: 'left',
            width: 50,
        },
        {
            title: '名称',
            copyable: true,
            width: 200,
            dataIndex: 'product_name',
            render: (val) => {
                return val
            }
        },
        {
            title: '英文名',
            width: 200,
            copyable: true,
            dataIndex: 'product_name_en',
        },
        {
            title: '最小参与/赎回金额',
            search: false,
            width: 200,
            valueType: 'money',
            dataIndex: 'min_amount',
        },
        {
            title: '已参与额度',
            search: false,
            valueType: 'money',
            dataIndex: 'participated_amount',
        },
        {
            title: '剩余额度',
            search: false,
            width: 150,
            valueType: 'money',
            dataIndex: 'remaining_amount',
        },
        {
            title: '累计收益率',
            search: false,
            dataIndex: 'profit_rate',
            render: (val) => {
                return `${val}%`
            }
        },
        {
            title: '收益(T+)',
            search: false,
            valueType: 'money',
            dataIndex: 'profit_days',
        },
        {
            disable: true,
            title: '状态',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
                1: { text: '1', status: 'Warning' },
                2: {
                    text: '2',
                    status: 'Error',
                },
                3: {
                    text: '3',
                    status: 'Success',
                    disabled: true,
                },
                4: {
                    text: '4',
                    status: 'Processing',
                },
            },
        },
        {
            title: '操作',
            valueType: 'option',
            fixed: 'right',
            width: 100,
            key: 'option',
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        setOptionModal({
                            visible: true,
                            id: record.id,
                        })
                    }}
                >
                    编辑
                </a>,
            ],
        },
    ];

    const reload = () => actionRef?.current?.reload?.()

    const onClose = () => {
        setOptionModal(initOptionModal)
        reload()
    }

    return <PageContainer>
        <Spin spinning={loading}>
            <ProTable
                columns={columns}
                actionRef={actionRef}
                cardBordered
                scroll={{ x: 1500 }}
                request={async (params: any) => await list(params)}
                rowKey="id"
                pagination={{ pageSize: 10, showQuickJumper: true }}
                headerTitle="表格"
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} onClick={() => setOptionModal({
                        visible: true,
                        id: undefined
                    })} type="primary">
                        新建
                    </Button>,
                ]}
            />
        </Spin>
        <OptionModal {...optionModal} onCancel={onClose} />
    </PageContainer>
};