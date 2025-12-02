import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
    Card, 
    Space, 
    Form, Input, InputNumber, 
    Table, 
    Row,
    Col,
    Button,
    Popconfirm,
    DatePicker,
    Select,
    Checkbox,
    message } from 'antd'
import Breadcrumb from "@/common/Breadcrumb";
import { api } from '@/api'
import { AddButton, DeleteButton, EditButton } from '@/common/Button'
import { roleAccess } from '@/helpers/menu'
import { SaveOutlined, CloseSquareOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { SearchColumn, FilterColumn } from "@/common/SearchColumn";

import HeaderLayout from '@/layouts/Header';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    required,
    selectDatas,
    ...restProps
  }) => {
    const [checked, setChecked] = useState(inputType == 'checkbox' && record[dataIndex] ? true : false);

    const handleCheck = (e) => {
        setChecked(e.checked);
    };
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: required
                        },
                    ]}
                    valuePropName={inputType == 'checkbox' ? 'checked' : 'value'}
                >

                    { inputType == 'date' ? <DatePicker placeholder={title} />
                    : inputType == 'number'? <InputNumber placeholder={title} style={{ width: '100%'}} min="1" />
                    : inputType == 'input'? <Input placeholder={title} />
                    : inputType == 'select'?
                        <Select
                            showSearch
                            style={{
                                width: '100%',
                            }}
                            placeholder={title}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={selectDatas}
                        />
                    : inputType == 'checkbox' ? 
                        <>
                            <Checkbox defaultChecked={checked ? true : false} onChange={(e) => handleCheck(e.target)} />
                        </>
                    : null }
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const Workflow = () => {
    const { stockTakingId } = useParams()
    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false);
    const [datas, setDatas] = useState([]);
    const [data, setData] = useState([]);
    const [locations, setLocations] = useState([]);
    const [workflows, setWorkflows] = useState([]);
    const [stockTaking, setStockTaking] = useState([])
    const [paginationPage, setPaginationPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingKey, setEditingKey] = useState('');
    const [isNew, setIsNew] = useState(true);
    
    const isEditing = (record) => record.id === editingKey;

    const fetchStockTaking = () => {
        api("GET", `stock-taking/${stockTakingId}`).then((res) => {
            setStockTaking(res.data)
        })
    }

    const fetchData = () => {
        setLoading(true)
        api("GET", `workflows/${stockTakingId}`).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const fetchLocation = () => {
        api("GET", `workflow/location/${stockTakingId}`).then((res) => {
            let location = []
            res?.data?.forEach(e => {
                let obj = { label: e.location_name, value: e.location_id, text: e.location_name }
                location.push(obj)
            });
            setLocations(location)
        })
    }

    const fetchWorkflow = () => {
        api("GET", `constants?category=workflow`).then((res) => {
            var workflow = []
            res.data?.map((e) => {
                workflow.push({ label: e.name, value: e.id, text: e.name })
            })
            setWorkflows(workflow)
        })
    }

    useEffect(() => {
        fetchData()
        fetchLocation()
        fetchWorkflow()
        fetchStockTaking()
    }, []);

    const add = () => {
        var key = uuidv4();
        const newData = {
            id: key,
            location_name: '',
            // type: '',
            workflow: null,
            sequence: null,
            user: '',
            name: '',
        };

        form.setFieldsValue({
            location_name: null,
            // type: '',
            workflow: null,
            sequence: null,
            user: '',
            name: '',
        })

        setDatas([newData, ...datas]);
        setEditingKey(key)
        setIsNew(false)
    }

    const edit = (record) => {
        form.setFieldsValue({ ...record,
            location_name: record.location_id,
            // type: record.type,
            workflow: record.workflow,
            sequence: record.sequence,
            user: record.user,
            name: record.name,
        })
        setEditingKey(record.id)
        setIsNew(false)
    }

    const cancel = () => {
        fetchData()
        setEditingKey('');
        setIsNew(true)
    };

    const transferFromAstro = () => {
        setSaving(true)
        api("POST", `workflow/transfer/${stockTakingId}`).then((res) => {
            fetchData()
            message.success('Successfully transfer workflow from ASTRO')
            setSaving(false)
        })
    }

    const destroy = (v) => {
        api("DELETE", `workflow/${v}`).then((res) => {
            message.success("Successfully deleted data")
            fetchData()
        })
    }

    const save = async () => {
        try {
            const data = await form.validateFields();

            let payload = {
                stock_taking_id: stockTakingId,
                name: data.name,
                location_id: locations?.find((e) => e.value == data.location_name)?.value,
                location_name: locations?.find((e) => e.value == data.location_name)?.text,
                // type: data.type,
                workflow: data.workflow,
                sequence: data.sequence,
                user: data.user,
            }
            setSaving(true)
            if (!Number.isInteger(editingKey)) {
                api("POST", "workflow", payload).then((res) => {
                    setSaving(false)
                    message.success('Successfully saved data')
                    fetchData()
                    setEditingKey('');
                }).catch((err) => {
                    setSaving(false)
                    message.warning('Failed to saving data')
                })
            } else {
                api("PUT", `workflow/${editingKey}`, payload).then((res) => {
                    setSaving(false)
                    message.success('Successfully saved data')
                    fetchData()

                    setEditingKey('');
                }).catch((err) => {
                    setSaving(false)
                    message.warning('Failed to saved data')
                })
            }
            setIsNew(true)
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    
    }

    const handleChangePagination = (el) => {
        setLoading(true)
        api("GET", `workflows/${stockTakingId}?page=${el.current}&limit=${el.pageSize}`).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
        setPaginationPage(el.current)
        setPageSize(el.pageSize)
    }

    const handleSearch = (el) => {
        setLoading(true)
        var payload = {
            params: Object.keys(el),
            value: Object.values(el)
        }
        api("GET",  `workflows/${stockTakingId}`, payload).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const columns = [
        Object.assign(
            {
                title: 'Location',
                dataIndex: 'location_name',
                key: 'location_name',
                width: 150,
                editable: true,
                required: true,
                selectDatas: locations,
            },
            SearchColumn('location_name', handleSearch),
        ),
        // Object.assign(
        //     {
        //         title: 'Type',
        //         dataIndex: 'type',
        //         key: 'type',
        //         width: 50,
        //         editable: true,
        //         required: true,
        //         selectDatas: [
        //             { label: 'Input', value: 'Input' },
        //             { label: 'Audit', value: 'Audit' },
        //         ],
        //     },
        //     FilterColumn('type', handleSearch, [
        //         { text: 'Input', value: 'Input' },
        //         { text: 'Audit', value: 'Audit' },
        //     ]),
        // ),
        Object.assign(
            {
                title: 'Workflow',
                dataIndex: 'workflow',
                key: 'workflow',
                width: 50,
                editable: true,
                required: true,
                selectDatas: workflows,
            },
            FilterColumn('workflow', handleSearch, workflows),
        ),

        Object.assign(
            {
                title: 'Sequence',
                dataIndex: 'sequence',
                key: 'sequence',
                width: 50,
                editable: true,
                required: true,
            },
            SearchColumn('sequence', handleSearch),
        ),
        Object.assign(
            {
                title: 'Username',
                dataIndex: 'user',
                key: 'user',
                width: 80,
                editable: true,
                required: true,
            },
            SearchColumn('user', handleSearch),
        ),
        Object.assign(
            {
                title: 'Title',
                dataIndex: 'name',
                key: 'name',
                width: 50,
                editable: true,
                required: true,
            },
            SearchColumn('name', handleSearch),
        ),
        {
            title: 'Action',
            width: 80,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button className='button-info'
                            type="primary" loading={saving} 
                            onClick={() => save(record.key)} icon={<SaveOutlined />}
                            style={{ marginRight: 5}}>
                        </Button>
                        <Popconfirm title="Are you sure?" onConfirm={cancel}>
                            <Button className='button-danger'
                                type="primary" icon={<CloseSquareOutlined />}>
                            </Button>
                        </Popconfirm>
                    </span>
                ) : (
                    <div className="text-center">
                        <Space>
                            {roleAccess('workflow edit') ?
                                <EditButton onEdit={() => edit(record)} />
                            : null}
                            {roleAccess('workflow delete') ?
                                <DeleteButton onConfirm={() => destroy(record.id)} />
                            : null}
                        </Space>
                    </div>
                );
            },
            align: 'center',
            fixed: 'right',
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        var inputType = col.dataIndex === 'name' || col.dataIndex === 'user' ? 'input'
        : col.dataIndex === 'sequence' ? 'number'
        : col.dataIndex === 'location_name' || 
        col.dataIndex === 'type' || col.dataIndex === 'workflow' ? 'select'
        : null

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                required: col.required,
                selectDatas: col.selectDatas,
            }),
        };
    });

    const components = {
        body: { cell: EditableCell },
    }

    return (
        <div>
            <HeaderLayout stockTake={stockTaking}/>

            {/* Breadcrumb */}
            <Breadcrumb mainTitle="Workflow"/>
  
            <Row gutter={[24]}>
                <Col xs={24} className="gutter-row">
                    <Card className="content-container">
                        <div className="full-width mb-3">
                            <Row justify="space-between">
                                <Col>
                                    { roleAccess('workflow add') ?
                                        <Popconfirm
                                            title="Are you sure transfer data from ASTRO ?"
                                            onConfirm={transferFromAstro}
                                            onCancel={(e) => console.log(e)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button className='button-primary' size="middle" 
                                                type="primary" loading={saving}
                                                style={{ marginRight: 10 }}>
                                                Transfer from ASTRO
                                            </Button>
                                        </Popconfirm>
                                    : null }
                                    { roleAccess('workflow add') && isNew ? 
                                        <AddButton onAdd={add} loading={saving} title="Add New Record" />
                                    : null }
                                </Col>
                                <Col>

                                </Col>
                            </Row>
                        </div>

                        <Card> 
                            <Form form={form} component={false}>
                                <Table size='small' bordered 
                                    components={components}
                                    dataSource={datas} 
                                    columns={mergedColumns}
                                    scroll={{ 
                                        x: 900,
                                        scrollToFirstRowOnChange: false 
                                    }}
                                    sticky={{
                                        offsetHeader: 70, // Distance from top when header becomes sticky
                                    }}
                                    rowClassName="editable-row"
                                    onChange={handleChangePagination}
                                    onSearch={handleSearch}
                                    loading={loading}
                                    pagination={{
                                        total: data.total,
                                        pageSize: pageSize,
                                        current: paginationPage,
                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                                    }} />
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Workflow