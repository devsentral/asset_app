import React, { useEffect, useState } from 'react'
import { Card, Space, Checkbox, Table, Popconfirm, message, Button, 
    Input, InputNumber, Row, Col, Form, Select, DatePicker 
} from 'antd'
import { api, authUser } from '@/api'
import { AddButton, DeleteButton, EditButton, ViewButton } from '@/common/Button'
import moment from 'moment'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from "@/common/Breadcrumb";
import { SearchColumn, FilterColumn, FilterDateColumn } from "@/common/SearchColumn";
import { roleAccess } from '@/helpers/menu'
import { SaveOutlined, CloseSquareOutlined } from '@ant-design/icons';

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
                    : inputType == 'number'? <InputNumber placeholder={title} />
                    : inputType == 'input'? <Input placeholder={title} />
                    : inputType == 'select'?
                        <Select
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

const StockTaking = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState([]);
    const [categories, setCategories] = useState([])
    const [data, setData] = useState([]);
    const [paginationPage, setPaginationPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingKey, setEditingKey] = useState('');
    const [isNew, setIsNew] = useState(true);
    const isEditing = (record) => record.id === editingKey;

    const fetchData = () => {
        setLoading(true)
        api("GET", `stock-takings`).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const fetchCategory = () => {
        api("GET", "constants?category=category").then((res) => {
            let category = []
            res?.data?.forEach(e => {
                let obj = { label: e.name, value: e.id, text: e.name }
                category.push(obj)
            });
            setCategories(category)
        })
    }

    useEffect(() => {
        fetchData()
        fetchCategory()
    }, []);

    const add = () => {
        var key = datas.length + 1;
        const newData = {
            id: key,
            name: '',
            active: 0,
            closed: 0,
            category_id: '',
            start_date: null,
            end_date: null,
            created_at: null,
        };

        form.setFieldsValue({
            name: '',
            active: 0,
            closed: 0,
            category_id: '',
            start_date: null,
            end_date: null,
            created_at: null,
        })

        setDatas([newData, ...datas]);
        setEditingKey(key)
        setIsNew(false)
    }

    const edit = (record) => {
        form.setFieldsValue({ ...record,
            category_id: record.category_id,
            start_date: record.start_date ? dayjs(record.start_date) : null,
            end_date: record.end_date ? dayjs(record.end_date) : null,
            active: record.active ? 1 : 0,
            closed: record.closed ? 1 : 0,
        })
        setEditingKey(record.id)
        setIsNew(false)
    }

    const cancel = () => {
        fetchData()
        setEditingKey('');
        setIsNew(true)
    };

    const close = (v) => {
        var payload = {
            active: 0,
            closed: 1,
        }
        api("PUT", `stock-taking/${v}`, payload).then((res) => {
            setSaving(false)
            message.success('Successfully close stock taking')
            fetchData()

            setEditingKey('');
        }).catch((err) => {
            setSaving(false)
            message.warning('Failed to close stock taking')
        })
    }

    const save = async () => {
        try {
            const data = await form.validateFields();
            let payload = {
                name: data.name,
                category_id: data.category_id,
                start_date: data.start_date ? dayjs(data.start_date).format("YYYY-MM-DD") : '',
                end_date: data.end_date ? dayjs(data.end_date).format("YYYY-MM-DD") : '',
                active: data.active ? 1 : 0,
                closed: data.closed ? 1 : 0,
            }
            setSaving(true)
            if (Number.isInteger(editingKey)) {
                api("POST", "stock-taking", payload).then((res) => {
                    setSaving(false)
                    message.success('Successfully saved data')
                    fetchData()
                    setEditingKey('');
                }).catch((err) => {
                    setSaving(false)
                    message.warning('Failed to saving data')
                })
            } else {
                api("PUT", `stock-taking/${editingKey}`, payload).then((res) => {
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
        api("GET", `stock-takings?page=${el.current}&limit=${el.pageSize}`).then((res) => {
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
        api("GET", `stock-takings`, payload).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const columns = [
        Object.assign(
            {
                title: 'Title',
                key: 'name',
                dataIndex: 'name',
                fixed: 'left',
                width: 250,
                editable: true,
                required: true,
            },
            SearchColumn('name', handleSearch),
        ),
        Object.assign(
            {
                title: 'Active',
                key: 'active',
                dataIndex: 'active',
                align: 'center',
                render: (row) => (
                    <Checkbox defaultChecked={row == 1 ? true : false} disabled />
                ),
                width: 100,
                editable: true,
            },
            FilterColumn('active', handleSearch, [
                { text: 'Active', value: 'active' },
                { text: 'Not Active', value: 'not_active' },
            ]),
        ),
        Object.assign(
            {
                title: 'Closed',
                key: 'closed',
                dataIndex: 'closed',
                align: 'center',
                render: (row) => (
                    <Checkbox defaultChecked={row ? true : false} disabled />
                ),
                width: 100,
                editable: true,
            },
            FilterColumn('closed', handleSearch, [
                { text: 'Closed', value: 'closed' },
                { text: 'Open', value: 'open' },
            ]),
        ),
        Object.assign(
            {
                title: 'Category',
                key: 'category',
                dataIndex: 'category_id',
                render: (row) => (
                    categories?.find((e) => e.value == row)?.text
                ),
                width: 120,
                editable: true,
                required: true,
                selectDatas: categories,
            },
            FilterColumn('category_id', handleSearch, categories),
        ),
        Object.assign(
            {
                title: 'Start Date',
                key: 'start_date',
                dataIndex: 'start_date',
                render: (text) => (
                    text === null ? '-' : moment(text).format('DD MMMM YYYY')
                ),
                width: 150,
                editable: true,
                required: true,
            },
            FilterDateColumn('start_date', handleSearch),
        ),
        Object.assign(
            {
                title: 'End Date',
                key: 'end_date',
                dataIndex: 'end_date',
                render: (text) => (
                    text === null ? '-' : moment(text).format('DD MMMM YYYY')
                ),
                width: 150,
                editable: true,
                required: true,
            },
            FilterDateColumn('end_date', handleSearch),
        ),
        {
            title: 'Created At',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => (
                text === null ? '-' : moment(text).format('DD MMMM YYYY, HH:mm:ss')
            ),
            align: 'center',
            width: 200
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
            width: 150,
            align: 'center'
        },
        {
            title: 'Action',
            width: 250,
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
                            {roleAccess('stock taking view') ?
                                <ViewButton title="Open" onShow={() => navigate(`/stock-taking/preview/${record.id}`)} />
                            : null}
                            {roleAccess('stock taking edit') && record.active ?
                                <EditButton onEdit={() => edit(record)} />
                            : null}
                            {roleAccess('stock taking cancel') && record.active ?
                                <DeleteButton title="Cancel" confirm_title="Cancel stock taking ?" onConfirm={() => close(record.id)} />
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

        var inputType = col.dataIndex === 'name' ? 'input'
        : col.dataIndex === 'active' ? 'checkbox'
        : col.dataIndex === 'closed' ? 'checkbox'
        : col.dataIndex === 'category_id' ? 'select'
        : col.dataIndex === 'start_date' ? 'date'
        : col.dataIndex === 'end_date' ? 'date'
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
            <HeaderLayout />

            {/* Breadcrumb */}
            <Breadcrumb pageTitle="Stock Taking Event" />
  
            {/* <Row gutter={[24]}/> */}
            <Row>
                <Col xs={24} className="gutter-row">
                    <Card className="content-container">
                        <Card title={
                            <div className="full-width">
                                <Row justify="space-between">
                                    <Col>
                                    </Col>
                                    <Col>
                                        <Space>
                                            { roleAccess('stock taking add') && isNew ? 
                                                <AddButton right onAdd={add} title="Create Event" />
                                            : null }
                                        </Space>
                                    </Col>
                                </Row>
                            </div>
                        }>
                            <Form form={form} component={false}>
                                <Table 
                                    size='small' 
                                    bordered 
                                    components={components}
                                    dataSource={datas} 
                                    columns={mergedColumns} 
                                    rowClassName="editable-row"
                                    scroll={{ 
                                        x: 900,
                                        scrollToFirstRowOnChange: false 
                                    }}
                                    sticky={{
                                        offsetHeader: 70, // Distance from top when header becomes sticky
                                    }}
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

export default StockTaking