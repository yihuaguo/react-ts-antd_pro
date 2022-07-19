import { message, Modal, Spin } from 'antd'
import { useBoolean } from 'ahooks'
import { useEffect, useRef } from 'react';
import { list } from '@/services/list'
import { ProForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';

interface InitOptionModal {
    visible: boolean,
    id: undefined | string,
    onCancel: Function
}

const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
}

const OptionModal = ({ visible, id, onCancel = () => { } }: InitOptionModal) => {

    const formRef = useRef<ProFormInstance>()
    const [loading, { setTrue, setFalse }] = useBoolean(false);

    useEffect(() => {
        // 编辑状态
        if (visible && id) {
            setTrue()
            list({ pageSize: 10, current: 1 }).then(() => {
                formRef?.current?.setFieldsValue?.({ text: '文字', type: '1' })
            }).catch(() => {
                message.error('获取详情错误！')
            }).finally(() => setFalse())
        }
    }, [visible])

    const onSubmit = () => {
        formRef.current?.validateFieldsReturnFormatValue?.().then(values => {
            setTrue()
            const params = { ...values }
            if (id) {
                // 编辑
                list({ pageSize: 10, current: 1 }).then(() => {
                    onClose()
                }).catch(() => {
                    message.error('编辑失败！')
                }).finally(() => setFalse())
            } else {
                // 新增
                list({ pageSize: 10, current: 1 }).then(() => {
                    onClose()
                }).catch(() => {
                    message.error('新增失败！')
                })
            }
        })
    }

    const onClose = () => {
        if (loading) return
        onCancel()
    }

    return <Modal
        visible={visible}
        title={id ? '编辑' : '新增'}
        onOk={onSubmit}

        onCancel={onClose}
        destroyOnClose={true}
        maskClosable={false}
    >
        <Spin spinning={loading}>
            <ProForm
                {...formLayout}
                formRef={formRef}
                layout="horizontal"
                submitter={false}
            >
                <ProFormText
                    width="lg"
                    name="text"
                    label="文字"
                    placeholder="请输入文字"
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormSelect
                    width="lg"
                    name="type"
                    label="类型"
                    placeholder="请选择类型"
                    valueEnum={{
                        0: '禁止',
                        1: '启用',
                    }}
                    rules={[{ required: true, message: '这是必选项' }]}
                />
            </ProForm>
        </Spin>
    </Modal>
}

export default OptionModal