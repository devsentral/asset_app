import React, { useEffect, useState } from 'react'
import { 
    Form, 
    Input,
    Card, 
    Table, 
    Col, 
    Row, 
    Button,
    message
} from 'antd'
import { api } from '@/api'
import { CheckOutlined } from '@ant-design/icons'
import { roleAccess } from '@/helpers/menu'

const { TextArea } = Input;

const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    disabled,
    ...restProps
  }) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={`${record.status.toLowerCase()}_${dataIndex}`}
                    style={{ margin: 0 }}
                    rules={[
                    {
                        required: true
                    },
                    ]}
                >
                    <TextArea rows={2} placeholder={'Remark/Suggestion'} maxLength={200} disabled={disabled}/>
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const Remark = (props) => {
    const [form] = Form.useForm()
    const { data } = props
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [summaryNotes, setSummaryNotes] = useState([])
    const [labelingNotes, setLabelingNotes] = useState([])
    const [idleNotes, setIdleNotes] = useState([])
    const [conditionNotes, setConditionNotes] = useState([])

    const fetchData = () => {
        setLoading(true)
        api("GET", `stock-taking-audit/remark/${data?.id}`).then((res) => {

            setSummaryNotes([
                {
                    status: 'Found',
                    remark: '',
                },
                {
                    status: 'Transfer',
                    remark: '',
                },
                {
                    status: 'Disposed',
                    remark: '',
                },
                {
                    status: 'Lost',
                    remark: '',
                },
            ])
            setLabelingNotes([
                {
                    status: 'Complete',
                    remark: '',
                },
                {
                    status: 'Incomplete',
                    remark: '',
                },
            ])
            setIdleNotes([
                {
                    status: 'Used',
                    remark: '',
                },
                {
                    status: 'Idle',
                    remark: '',
                },
            ])
            setConditionNotes([
                {
                    status: 'Good',
                    remark: '',
                },
                {
                    status: 'Broken',
                    remark: '',
                },
            ])

            form.setFieldValue('general_remark', res.data?.audit_general_notes)
            form.setFieldValue('found_remark', res.data?.audit_found_notes)
            form.setFieldValue('transfer_remark', res.data?.audit_transfer_notes)
            form.setFieldValue('disposed_remark', res.data?.audit_disposed_notes)
            form.setFieldValue('lost_remark', res.data?.audit_lost_notes)
            form.setFieldValue('complete_remark', res.data?.audit_complete_notes)
            form.setFieldValue('incomplete_remark', res.data?.audit_incomplete_notes)
            form.setFieldValue('used_remark', res.data?.audit_used_notes)
            form.setFieldValue('idle_remark', res.data?.audit_idle_notes)
            form.setFieldValue('good_remark', res.data?.audit_good_notes)
            form.setFieldValue('broken_remark', res.data?.audit_broken_notes)

            setLoading(false)
        })
    }

    const save = async () => {
        setSaving(true)
        try {
            const formData = await form.validateFields();

            let payload = {
                stock_taking_location_id: data?.id,
                stock_taking_id: data?.stock_taking_id,
                audit_general_notes: formData?.general_remark,
                audit_found_notes: formData?.found_remark,
                audit_transfer_notes: formData?.transfer_remark,
                audit_disposed_notes: formData?.disposed_remark,
                audit_lost_notes: formData?.lost_remark,
                audit_complete_notes: formData?.complete_remark,
                audit_incomplete_notes: formData?.incomplete_remark,
                audit_used_notes: formData?.used_remark,
                audit_idle_notes: formData?.idle_remark,
                audit_good_notes: formData?.good_remark,
                audit_broken_notes: formData?.broken_remark,
            }

            api("POST", `stock-taking-audit/remark/${data?.id}`, payload).then((res) => {
                setSaving(false)
                message.success('Successfully saved data')
                fetchData()

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }).catch((err) => {
                setSaving(false)
                message.warning('Failed to saving data')
            })
        } catch (errInfo) {
            setSaving(false)
            console.log('Validate Failed:', errInfo);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const column_summary_notes = [
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
            width: 200,
            editable: false,
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            align: 'center',
            width: 800,
            editable: true,
        },
    ];

    const components = {
        body: { cell: EditableCell },
    }

    const mergedColumns = column_summary_notes.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: true,
                disabled: data?.status_audit != 'ACTIVE',
            }),
        };
    });

    return (
        <Card className="content-container">
            <div className="full-width mb-3">
                <Row justify="space-between">
                    <Col>
                        
                    </Col>
                    <Col>
                        { roleAccess('stock audit edit') && data?.status_audit == 'ACTIVE' ? 
                            <Button className='button-primary' loading={saving} 
                                size="middle" type="primary" icon={<CheckOutlined />} onClick={save}>
                                Save
                            </Button>
                        : null }
                    </Col>
                </Row>
            </div>
            
            <Form form={form} component={false}>
                <div className="full-width mb-3">
                    <p><strong>General Remark</strong> (Please fill the remark/suggestion) <code style={{ color: 'red' }}>*</code></p>
                    <Form.Item
                        name="general_remark"
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true
                            },
                        ]}
                    >
                        <TextArea rows={2} disabled={data?.status_audit != 'ACTIVE'}
                        placeholder={'Remark/Suggestion'} maxLength={200} />
                    </Form.Item>
                </div>

                <div style={{ marginTop: 30 }} className="full-width mb-3">
                    <Row justify="space-between">
                        <Col>
                            <strong>Result Summaries</strong> (Please fill the remark/suggestion) <code style={{ color: 'red' }}>*</code>
                        </Col>
                    </Row>
                </div>

                <Table size='small' bordered
                    components={components}
                    dataSource={summaryNotes} 
                    columns={mergedColumns} 
                    rowClassName="editable-row"
                    loading={loading}
                    pagination={false}/>

                <div style={{ marginTop: 30 }} className="full-width mb-3">
                    <Row justify="space-between">
                        <Col>
                            <strong>Labeling Summaries</strong> (Please fill the remark/suggestion) <code style={{ color: 'red' }}>*</code>
                        </Col>
                    </Row>
                </div>

                <Table size='small' bordered
                    components={components}
                    dataSource={labelingNotes} 
                    columns={mergedColumns} 
                    rowClassName="editable-row"
                    loading={loading}
                    pagination={false}/>
                
                <div style={{ marginTop: 30 }} className="full-width mb-3">
                    <Row justify="space-between">
                        <Col>
                            <strong>Idle Summaries</strong> (Please fill the remark/suggestion) <code style={{ color: 'red' }}>*</code>
                        </Col>
                    </Row>
                </div>

                <Table size='small' bordered
                    components={components}
                    dataSource={idleNotes} 
                    columns={mergedColumns} 
                    rowClassName="editable-row"
                    loading={loading}
                    pagination={false}/>
                

                <div style={{ marginTop: 30 }} className="full-width mb-3">
                    <Row justify="space-between">
                        <Col>
                            <strong>Physical condition Summaries</strong> (Please fill the remark/suggestion) <code style={{ color: 'red' }}>*</code>
                        </Col>
                    </Row>
                </div>

                <Table size='small' bordered
                    components={components}
                    dataSource={conditionNotes} 
                    columns={mergedColumns} 
                    rowClassName="editable-row"
                    loading={loading}
                    pagination={false}/>
            </Form>

        </Card>
    )
}

export default Remark