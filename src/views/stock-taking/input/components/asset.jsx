import React, { useEffect, useState } from 'react'
import { Form, Space, Row, Col,
    Input, Button, Table, Select, DatePicker, 
    Popconfirm, message, Modal } from 'antd'
import { api } from '@/api'
import { AddButton, EditButton, DeleteButton } from '@/common/Button'
import { roleAccess } from '@/helpers/menu'
import dayjs from 'dayjs'
import { SearchColumn, FilterColumn, FilterYearColumn, FilterDateColumn } from "@/common/SearchColumn";
import { CheckOutlined, SaveOutlined, CloseSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

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
    onChange,
    ...restProps
  }) => {
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
                >

                    { inputType == 'year' ? <DatePicker placeholder={title}  picker="year"/>
                    : inputType == 'date'? <DatePicker placeholder={title} />
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
                            onChange={onChange}
                            options={selectDatas}
                        />
                    : null }
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const Asset = ({ location }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [datas, setDatas] = useState([])
    const [data, setData] = useState([])
    const [results, setResults] = useState([])
    const [customs, setCustoms] = useState([])
    const [locations, setLocations] = useState([])

    const [paginationPage, setPaginationPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingKey, setEditingKey] = useState('');
    const [isNew, setIsNew] = useState(true);
    const [transferTo, setTransferTo] = useState(null);

    const isEditing = (record) => record.id === editingKey;

    const fetchData = () => {
        setLoading(true)
        api("GET", `stock-taking-assets/${location?.id}?stock_taking_id=${location?.stock_taking_id}`).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const fetchResult = () => {
        api("GET", `constants?category=result`).then((res) => {
            var result = []
            res.data?.map((e) => {
                result.push({ label: e.name, value: e.id, text: e.name })
            })
            setResults(result)
        })
    }


    const fetchCustomsType = () => {
        api("GET", `constants?category=customs_type`).then((res) => {
            var custom = []
            res.data?.map((e) => {
                custom.push({ label: e.name, value: e.id, text: e.name })
            })
            setCustoms(custom)
        })
    }

    const fetchLocation = () => {
        api("GET", `stock-taking-locations/${location?.stock_taking_id}?limit=5000`).then((res) => {
            var location = []
            res.data?.data?.map((e) => {
                location.push({ label: e.location_name, value: e.location_id, text: e.location_name })
            })
            setLocations(location)
        })
    }

    useEffect(() => {
        fetchData()
        fetchResult()
        fetchCustomsType()
        fetchLocation()
    }, [location?.id]);

    const add = () => {
        var key = datas.length + 1;
        const newData = {
            id: key,
            asset_id: null,
            class_name: '',
            serial_number: '',
            asset_number: '',
            material_name: '',
            result: '',
            sticker: '',
            plate: '',
            usage: '',
            condition: '',
            last_running_asp: null,
            last_running_mp: null,
            common_part: '',
            remark: '',
            bc_type: '',
            bc_number: '',
            bc_issue_date: null,
        };

        form.setFieldsValue({
            asset_id: null,
            class_name: null,
            serial_number: null,
            asset_number: null,
            material_name: null,
            result: null,
            sticker: null,
            plate: null,
            usage: null,
            condition: null,
            last_running_asp: null,
            last_running_mp: null,
            common_part: null,
            remark: null,
            bc_type: null,
            bc_number: null,
            bc_issue_date: null,
        })

        setDatas([newData, ...datas]);
        setEditingKey(key)
        setIsNew(false)
    }

    const edit = (record) => {
        form.setFieldsValue({ ...record,
            last_running_asp: record.last_running_asp ? dayjs(record.last_running_asp + '-01-01') : null,
            last_running_mp: record.last_running_mp ? dayjs(record.last_running_mp + '-01-01') : null,
            bc_issue_date: record.bc_issue_date ? dayjs(record.bc_issue_date) : null,
        })
        setEditingKey(record.id)
        setIsNew(false)
    }

    const cancel = () => {
        setEditingKey('');
        fetchData()
        setIsNew(false)
    };

    const destroy = (v) => {
        api("DELETE", `stock-taking-asset/${v}`).then((res) => {
            message.success("Successfully deleted data")
            fetchData()
        })
    }

    const save = async () => {
        try {
            const data = await form.validateFields();
            let payload = {
                stock_taking_id: location.stock_taking_id,
                stock_taking_location_id: location?.id,
                location_id: location.location_id,
                location_name: location.location_name,
                asset_id: data.asset_id,
                class_name: data.class_name,
                serial_number: data.serial_number,
                asset_number: data.asset_number,
                material_name: data.material_name,
                result: data.result,
                sticker: data.sticker ? 1 : 0,
                plate: data.plate ? 1 : 0,
                usage: data.usage ? 1 : 0,
                condition: data.condition ? 1 : 0,
                model: data.model,
                facs: data.facs ? 1: 0,
                last_running_asp: data.last_running_asp ? data.last_running_asp.format('YYYY') : null,
                last_running_mp: data.last_running_mp ? data.last_running_mp.format('YYYY') : null,
                common_part_code: data.common_part_code,
                detail_location: data.detail_location,
                pic: data.pic,
                future_plan: data.future_plan ? 1 : 0,
                remark: data.remark,
                bc_type: data.bc_type,
                bc_number: data.bc_number,
                bc_issue_date: data.bc_issue_date? data.bc_issue_date.format('YYYY-MM-DD') : null,
                status: 'ON PROGRESS'
            }
            if (Number.isInteger(editingKey)) {
                api("POST", "stock-taking-asset", payload).then((res) => {
                    setSaving(false)
                    message.success('Successfully saved data')
                    fetchData()

                    setEditingKey('');
                }).catch((err) => {
                    setSaving(false)
                    message.warning('Failed to saving data')
                })
            } else {
                api("PUT", `stock-taking-asset/${editingKey}`, payload).then((res) => {
                    setSaving(false)
                    message.success('Successfully saved data')
                    fetchData()

                    setEditingKey('');
                }).catch((err) => {
                    setSaving(false)
                    message.warning('Failed to saved data')
                })
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    
    }

    const handleChangePagination = (el) => {
        setLoading(true)
        api("GET", `stock-taking-assets/${location?.id}?page=${el.current}&limit=${el.pageSize}`).then((res) => {
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
        api("GET", `stock-taking-assets/${location?.id}`, payload).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const columns = [
        {
            title: 'Action',
            width: 200,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button className='button-info'
                            type="primary" onClick={() => save(record.key)} icon={<SaveOutlined />}
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
                            {roleAccess('stock take edit') && location.status_input == 'ACTIVE' ?
                                <EditButton onEdit={() => edit(record)} />
                            : null}
                            {roleAccess('stock take delete') && location.status_input == 'ACTIVE' && !record?.asset_id ?
                                <DeleteButton onConfirm={() => destroy(record.id)} />
                            : null}
                        </Space>
                    </div>
                );
            },
            align: 'center',
            fixed: 'left',
        },
        Object.assign(
            {
                title: 'Asset Number',
                dataIndex: 'asset_number',
                key: 'reference',
                inputType: 'input',
                fixed: 'left',
                width: 150,
                editable: roleAccess('stock taking add') ? true : false,
                required: true,
            },
            SearchColumn('asset_number', handleSearch),
        ),
        Object.assign(
            {
                title: 'Asset Class',
                dataIndex: 'class_name',
                key: 'class_name',
                inputType: 'input',
                width: 150,
                fixed: 'left',
                editable: roleAccess('stock taking add') ? true : false,
                required: true,
            },
            SearchColumn('class_name', handleSearch),
        ),
        Object.assign(
            {
                title: 'Result',
                key: 'result',
                dataIndex: 'result',
                render: (row) => (
                    results?.find((e) => e.value == row)?.label ?? '-'
                ),
                width: 150,
                inputType: 'select',
                editable: true,
                required: true,
                selectDatas: results,
            },
            FilterColumn('result', handleSearch, results),
        ),
        Object.assign(
            {
                title: 'Stock Sticker',
                dataIndex: 'sticker',
                render: (row) => (
                    [0, 1, '', null]?.includes(row) ?
                        row ? 'Yes' : 'No'
                    : '-'
                ),
                width: 100,
                inputType: 'select',
                editable: true,
                required: true,
                selectDatas: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }],
            },
            FilterColumn('sticker', handleSearch, [
                { text: 'Yes', value: '1' },
                { text: 'No', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Plate',
                dataIndex: 'plate',
                render: (row) => (
                    [0, 1, '', null]?.includes(row) ?
                        row ? 'Complete' : 'Incomplete'
                    : '-'
                ),
                width: 140,
                inputType: 'select',
                editable: true,
                required: true,
                selectDatas: [{ label: 'Complete', value: 1 }, { label: 'Incomplete', value: 0 }],
            },
            FilterColumn('plate', handleSearch, [
                { text: 'Complete', value: '1' },
                { text: 'Incomplete', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Status Asset',
                dataIndex: 'usage',
                render: (row) => (
                    [0, 1, '', null]?.includes(row) ?
                        row ? 'Used' : 'Idle'
                    : '-'
                ),
                width: 100,
                inputType: 'select',
                editable: true,
                required: true,
                selectDatas: [{ label: 'Used', value: 1 }, { label: 'Idle', value: 0 }],
            },
            FilterColumn('usage', handleSearch, [
                { text: 'Used', value: '1' },
                { text: 'Idle', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Condition',
                dataIndex: 'condition',
                render: (row) => (
                    [0, 1, '', null]?.includes(row) ?
                        row ? 'Good' : 'Broken'
                    : '-'
                ),
                width: 140,
                inputType: 'select',
                editable: true,
                required: true,
                selectDatas: [{ label: 'Good', value: 1 }, { label: 'Broken', value: 0 }],
            },
            FilterColumn('condition', handleSearch, [
                { text: 'Good', value: '1' },
                { text: 'Broken', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Asset Name',
                dataIndex: 'material_name',
                key: 'name',
                inputType: 'input',
                width: 150,
                editable: roleAccess('stock taking add') ? true : false,
                required: true,
            },
            SearchColumn('material_name', handleSearch),
        ),
        Object.assign(
            {
                title: 'Part Code',
                dataIndex: 'material_code',
                key: 'part_code',
                width: 150,
            },
            SearchColumn('material_code', handleSearch),
        ),
        Object.assign(
            {
                title: 'Model',
                dataIndex: 'model',
                key: 'model',
                width: 150,
                editable: true,
            },
            SearchColumn('model', handleSearch),
        ),
        Object.assign(
            {
                title: 'FACS',
                dataIndex: 'facs',
                render: (row) => (
                    [0, 1, '', null]?.includes(row) ?
                        row ? 'Done' : 'Undone'
                    : '-'
                ),
                width: 140,
                inputType: 'select',
                editable: true,
                required: true,
                selectDatas: [{ label: 'Done', value: 1 }, { label: 'Undone', value: 0 }],
            },
            FilterColumn('facs', handleSearch, [
                { text: 'Done', value: '1' },
                { text: 'Undone', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Serial Number',
                dataIndex: 'serial_number',
                key: 'serial_number',
                inputType: 'input',
                width: 150,
                editable: roleAccess('stock taking add') ? true : false,
                required: true,
            },
            SearchColumn('serial_number', handleSearch),
        ),
        Object.assign(
            {
                title: 'Location',
                dataIndex: 'location_name',
                key: 'location_name',
                inputType: 'input',
                width: 200,
            },
            SearchColumn('location_name', handleSearch),
        ),
        Object.assign(
            {
                title: 'Details Location',
                dataIndex: 'detail_location',
                key: 'detail_location',
                inputType: 'input',
                width: 200,
                editable: true,
                required: true,
            },
            SearchColumn('detail_location', handleSearch),
        ),
        Object.assign(
            {
                title: 'PIC',
                dataIndex: 'pic',
                key: 'pic',
                inputType: 'input',
                width: 200,
                editable: true,
                required: true,
            },
            SearchColumn('pic', handleSearch),
        ),
        Object.assign(
            {
                title: 'Last Running MP',
                dataIndex: 'last_running_mp',
                width: 120,
                inputType: 'year',
                editable: true,
            },
            FilterYearColumn('last_running_mp', handleSearch),
        ),
        Object.assign(
            {
                title: 'Last Running ASP',
                dataIndex: 'last_running_asp',
                width: 120,
                inputType: 'year',
                editable: true
            },
            FilterYearColumn('last_running_asp', handleSearch),
        ),
        Object.assign(
            {
                title: 'Future Plan',
                dataIndex: 'future_plan',
                render: (row) => (
                    [0, 1, '', null]?.includes(row) ?
                        row ? 'Yes' : 'No'
                    : '-'
                ),
                width: 140,
                inputType: 'select',
                editable: true,
                required: true,
                selectDatas: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }],
            },
            FilterColumn('future_plan', handleSearch, [
                { text: 'Yes', value: '1' },
                { text: 'No', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Common Part Code',
                dataIndex: 'common_part_code',
                key: 'common_part_code',
                width: 120,
                inputType: 'input',
                editable: true,
            },
            SearchColumn('common_part_code', handleSearch),
        ),
        {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
            width: 120,
            inputType: 'input',
            editable: true,
        },
        Object.assign(
            {
                title: 'Budget No',
                dataIndex: 'budget_number',
                key: 'budget_number',
                width: 100,
            },
            SearchColumn('budget_number', handleSearch),
        ),
        Object.assign(
            {
                title: 'Cap. Date',
                dataIndex: 'acquisition_date',
                key: 'acquisition_date',
                width: 150,
            },
            SearchColumn('acquisition_date', handleSearch),
        ),
        Object.assign(
            {
                title: 'BC Type',
                dataIndex: 'bc_type',
                render: (row) => (
                    customs?.find((e) => e.value == row)?.label ?? '-'
                ),
                width: 130,
                inputType: 'select',
                editable: true,
                selectDatas: customs,
            },
            FilterColumn('customs_type', handleSearch, customs),
        ),
        Object.assign(
            {
                title: 'BC Number',
                key: 'bc_number',
                dataIndex: 'bc_number',
                fixed: 'left',
                width: 120,
                inputType: 'input',
                editable: true,
            },
            SearchColumn('bc_number', handleSearch),
        ),
        Object.assign(
            {
                title: 'BC Date',
                dataIndex: 'bc_issue_date',
                key: 'bc_issue_date',
                render: (text) => (
                    text === null ? '-' : moment(text).format('DD MMMM YYYY')
                ),
                width: 150,
                inputType: 'date',
                editable: true,
            },
            FilterDateColumn('bc_issue_date', handleSearch),
        ),
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: ['last_running_asp','last_running_mp'].includes(col.dataIndex) && 
                !['ZDMO','PMO'].includes(record.class_code) ? false : isEditing(record),
                required: col.required,
                selectDatas: col.selectDatas,
                onChange: (e) => handleChange(e, record, col.dataIndex),
            }),
        };
    });

    const finish = () => {
        if(!location?.stock_taking_remark || !location?.stock_taking_remark?.input_general_notes) {
            message.warning('Please fill the remark/suggestion before finish stock taking')
            return;
        }

        setSaving(true)
        var payload = {
            stock_taking_id: location.stock_taking_id,
            stock_taking_location_id: location.id,
            location_id: location.location_id
        }

        api("POST", "stock-taking-asset/done", payload).then((res) => {
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
    }

    const components = {
        body: { cell: EditableCell },
    }

    const handleChange = (row, record, dataIndex) => {
        if(row == 4 && dataIndex == 'result') {
            setShowModal(!showModal)

            form.setFieldsValue({
                to_location_id: null,
            })
            setTransferTo(null)
        }
    }

    const saveTransfer = (el) => {
        setShowModal(!showModal)

        var location = locations?.find((e) => e.value == el.to_location_id)?.label;
        const parts = location.split(" - ");

        setTransferTo(null)
        form.setFieldsValue({
            remark: `Transfer to ${parts.length > 1 ? parts[1] : location}`,
        })
    }
    
    return (
        <>
            <div className="full-width mb-3" style={{ marginBottom: 10 }}>
                <Row justify="space-between">
                    <Col>
                        { roleAccess('stock take add') && location.status_input == 'ACTIVE' ? 
                            <AddButton right onAdd={add} title="Add Item" /> 
                        : null }
                    </Col>
                    <Col>
                        { roleAccess('stock take add') && location.status_input == 'ACTIVE' ? 
                            <Popconfirm
                                title="Are you sure to finish stock taking ?"
                                onConfirm={finish}
                                onCancel={(e) => console.log(e)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button className='button-primary' size="middle" 
                                loading={saving} type="primary" icon={<CheckOutlined />}>
                                    Finish
                                </Button>
                            </Popconfirm>
                        : null }
                        { location?.status_input != 'ACTIVE' ?
                            <p>Data submitted by <b>{location?.input_submitted_by}</b> on <b>{moment(location?.input_submitted_at).format('DD MMMM YYYY HH:mm:ss')}</b></p>
                        : null }
                    </Col>
                </Row>
            </div>

            <Form form={form} component={false}>
                <Table size='small' bordered
                    components={components}
                    dataSource={datas || []} 
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

            <Modal title="Transfer to" open={showModal} 
                footer={null}
                onCancel={() => setShowModal(!showModal)}>
                <Form onFinish={(e) => saveTransfer(e)}
                    layout='vertical'>
                        <Form.Item
                            name="to_location_id">
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Location"
                                value={transferTo}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={locations}
                            />
                        </Form.Item>
                        <Space>
                            <Form.Item>
                                <Button className="button-primary" type="primary" htmlType='submit'>
                                    Save
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => setShowModal(!showModal)} danger type="primary">
                                    Close
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
            </Modal>
        </>
    )
}

export default Asset