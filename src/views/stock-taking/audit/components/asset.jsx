import React, { useEffect, useState } from 'react'
import { Form, Space, Row, Col, 
    Input, Table, Button, 
    Select, DatePicker,
    Popconfirm, Modal, message,
    Checkbox, Carousel,
    Typography
} from 'antd'
import { api } from '@/api'
import { FileExcelOutlined } from '@ant-design/icons';
import { Uploader } from '@/common/Uploader'
import { EditButton } from '@/common/Button'
import { CheckOutlined } from '@ant-design/icons'
import { roleAccess } from '@/helpers/menu'
import dayjs from 'dayjs'
import { SearchColumn, FilterColumn, FilterYearColumn, FilterDateColumn } from "@/common/SearchColumn";
import { SaveOutlined, CloseSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

const imageStyle = {
    width: '100%',
    height: 'auto',
    display: 'block'
};

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

                    { inputType == 'year' ? <DatePicker placeholder={title}  picker="year"/>
                    : inputType == 'text'? <Input placeholder={title} />
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

const Asset = ({ location }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [datas, setDatas] = useState([])
    const [data, setData] = useState([])
    const [results, setResults] = useState([])
    const [customs, setCustoms] = useState([])
    const [modalTitle, setModalTitle] = useState(null);
    const [paginationPage, setPaginationPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [uploading, setUploading] = useState(false)
    const [showUpload, setShowUpload] = useState(false);
    const [showPicture, setShowPicture] = useState(false);
    const [loadingImg, setLoadingImg] = useState(false);
    const [pictures, setPictures] = useState([]);
    const [attachmentFile, setAttachmentFile] = useState(null)
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.id === editingKey;

    const fetchData = () => {
        setLoading(true)
        api("GET", `stock-taking-audits/${location?.id}`).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const fetchResult = () => {
        api("GET", "constants?category=result").then((res) => {
            let result = []
            res?.data?.forEach(e => {
                let obj = { label: e.name, value: e.id, text: e.name }
                result.push(obj)
            });
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

    useEffect(() => {
        fetchData()
        fetchResult()
        fetchCustomsType()
    }, [location?.id]);

    const edit = (record) => {
        form.setFieldsValue({ ...record,
            last_running_asp: record.last_running_asp ? dayjs(record.last_running_asp + '-01-01') : null,
            last_running_mp: record.last_running_mp ? dayjs(record.last_running_mp + '-01-01') : null,
        })
        setEditingKey(record.id)
    }

    const cancel = () => {
        setEditingKey('');
        fetchData()
    };

    const save = async () => {
        const data = await form.validateFields();
        let payload = {
            ...data,
            stock_taking_id: location?.stock_taking?.id,
            stock_taking_location_id: location?.id,
            result: data.result,
            sticker: data.sticker ? 1 : 0,
            plate: data.plate ? 1 : 0,
            usage: data.usage ? 1 : 0,
            condition: data.condition ? 1 : 0,
            last_running_asp: data.last_running_asp ? data.last_running_asp.format('YYYY') : null,
            last_running_mp: data.last_running_mp ? data.last_running_mp.format('YYYY') : null,
            common_part_code: data.common_part_code,
            remark: data.remark,
            status: 'ON PROGRESS'
        }

        setSaving(true)
        api("PUT", `stock-taking-audit/${editingKey}`, payload).then((res) => {
            setSaving(false)
            message.success('Successfully saved data')

            fetchData()
            setEditingKey('');
        }).catch((err) => {
            setSaving(false)
            message.warning('Failed to saving data')
        })
    }

    const handleChangePagination = (el) => {
        setLoading(true)
        api("GET", `stock-taking-audits/${location?.id}?page=${el.current}&limit=${el.pageSize}`).then((res) => {
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
        api("GET", `stock-taking-audits/${location?.id}`, payload).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const columns = [
        {
            title: 'Action',
            width: 150,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button className='button-info'
                            type="primary" onClick={() => save(record.key)} icon={<SaveOutlined />}
                            style={{ marginRight: 5 }}>
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
                            {roleAccess('stock audit edit') && location.status_audit == 'ACTIVE' ?
                                <EditButton onEdit={() => edit(record)} />
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
                title: 'Audited',
                key: 'audited',
                dataIndex: 'audited',
                render: (row) => (
                    [0,1].includes(row) ?
                        <Checkbox defaultChecked={row ? true : false} disabled />
                    : '-'
                ),
                width: 100,
                fixed: 'left',
                inputType: 'checkbox',
                editable: true,
                required: true,
            },
            FilterColumn('audited', handleSearch, [
                { text: 'Yes', value: '1' },
                { text: 'No', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Asset Number',
                dataIndex: 'asset_number',
                key: 'reference',
                width: 150,
                fixed: 'left',
            },
            SearchColumn('asset_number', handleSearch),
        ),
        Object.assign(
            {
                title: 'Asset Class',
                dataIndex: 'class_name',
                key: 'class_name',
                width: 150,
                fixed: 'left',
            },
            SearchColumn('class_name', handleSearch),
        ),
        {
            title: 'Result',
            editable: true,
            children: [
                Object.assign(
                    {
                        title: 'Input',
                        dataIndex: 'input_result',
                        width: 150,
                        render: (row) => (
                            results?.find((e) => e.value == row)?.label ?? '-'
                        ),
                        compare: 'result'
                    },
                    FilterColumn('input_result', handleSearch, results),
                ),
                Object.assign(
                    {
                        title: 'Audit',
                        dataIndex: 'result',
                        render: (row) => (
                            results?.find((e) => e.value == row)?.label ?? '-'
                        ),
                        width: 150,
                        inputType: 'select',
                        editable: true,
                        required: true,
                        compare: 'input_result',
                        selectDatas: results,
                    },
                    FilterColumn('result', handleSearch, results),
                )
            ],
        },
        {
            title: 'Stock Sticker',
            editable: true,
            children: [
                Object.assign(
                    {
                        title: 'Input',
                        dataIndex: 'input_sticker',
                        width: 150,
                        render: (row) => (
                            [0,1].includes(row) ?
                                row ? 'Yes' : 'No'
                            : '-'
                        ),
                        compare: 'sticker',
                    },
                    FilterColumn('input_sticker', handleSearch, [
                        { text: 'Yes', value: '1' }, 
                        { text: 'No', value: '0' },
                    ]),
                ),
                Object.assign(
                    {
                        title: 'Audit',
                        dataIndex: 'sticker',
                        render: (row) => (
                            [0,1].includes(row) ?
                                row ? 'Yes' : 'No'
                            : '-'
                        ),
                        width: 150,
                        inputType: 'select',
                        editable: true,
                        required: true,
                        compare: 'input_sticker',
                        selectDatas: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }],
                    },
                    FilterColumn('sticker', handleSearch, [
                        { text: 'Yes', value: '1' }, 
                        { text: 'No', value: '0' },
                    ]),
                )
            ],
        },
        {
            title: 'Plate',
            editable: true,
            children: [
                Object.assign(
                    {
                        title: 'Input',
                        dataIndex: 'input_plate',
                        width: 150,
                        render: (row) => (
                            [0,1].includes(row) ?
                                row ? 'Complete' : 'Incomplete'
                            : '-'
                        ),
                        compare: 'plate',
                    },
                    FilterColumn('input_plate', handleSearch, [
                        { text: 'Complete', value: '1' }, 
                        { text: 'Incomplete', value: '0' },
                    ]),
                ),
                Object.assign(
                    {
                        title: 'Audit',
                        dataIndex: 'plate',
                        render: (row) => (
                            [0,1].includes(row) ?
                                row ? 'Complete' : 'Incomplete'
                            : '-'
                        ),
                        width: 150,
                        inputType: 'select',
                        editable: true,
                        required: true,
                        compare: 'input_plate',
                        selectDatas: [{ label: 'Complete', value: 1 }, { label: 'Incomplete', value: 0 }],
                    },
                    FilterColumn('plate', handleSearch, [
                        { text: 'Complete', value: '1' }, 
                        { text: 'Incomplete', value: '0' },
                    ]),
                )
            ],
        },
        {
            title: 'Status Asset',
            editable: true,
            children: [
                Object.assign(
                    {
                        title: 'Input',
                        dataIndex: 'input_usage',
                        width: 150,
                        render: (row) => (
                            [0,1].includes(row) ?
                                row ? 'Used' : 'Idle'
                            : '-'
                        ),
                        compare: 'usage',
                    },
                    FilterColumn('input_usage', handleSearch, [
                        { text: 'Used', value: '1' }, 
                        { text: 'Idle', value: '0' },
                    ]),
                ),
                Object.assign(
                    {
                        title: 'Audit',
                        dataIndex: 'usage',
                        render: (row) => (
                            [0,1].includes(row) ?
                                row ? 'Used' : 'Idle'
                            : '-'
                        ),
                        width: 150,
                        inputType: 'select',
                        editable: true,
                        required: true,
                        compare: 'input_usage',
                        selectDatas: [{ label: 'Used', value: 1 }, { label: 'Idle', value: 0 }],
                    },
                    FilterColumn('usage', handleSearch, [
                        { text: 'Used', value: '1' }, 
                        { text: 'Idle', value: '0' },
                    ]),
                )
            ],
        },
        {
            title: 'Condition',
            editable: true,
            children: [
                Object.assign(
                    {
                        title: 'Input',
                        dataIndex: 'input_condition',
                        width: 150,
                        render: (row) => (
                            [0,1].includes(row) ?
                                row ? 'Good' : 'Broken'
                            : '-'
                        ),
                        compare: 'condition',
                    },
                    FilterColumn('input_condition', handleSearch, [
                        { text: 'Good', value: '1' }, 
                        { text: 'Broken', value: '0' },
                    ]),
                ),
                Object.assign(
                    {
                        title: 'Audit',
                        dataIndex: 'condition',
                        render: (row) => (
                            [0,1].includes(row) ?
                                row ? 'Good' : 'Broken'
                            : '-'
                        ),
                        width: 150,
                        inputType: 'select',
                        editable: true,
                        required: true,
                        compare: 'input_condition',
                        selectDatas: [{ label: 'Good', value: 1 }, { label: 'Broken', value: 0 }],
                    },
                    FilterColumn('condition', handleSearch, [
                        { text: 'Good', value: '1' }, 
                        { text: 'Broken', value: '0' },
                    ]),
                )   
            ],
        },
        {
            title: 'Last Running MP',
            editable: true,
            children: [
                Object.assign(
                    {
                        title: 'Input',
                        dataIndex: 'input_last_running_mp',
                        width: 150,
                        compare: 'last_running_mp',
                    },
                    FilterYearColumn('input_last_running_mp', handleSearch),
                ),
                Object.assign(
                    {
                        title: 'Audit',
                        dataIndex: 'last_running_mp',
                        width: 150,
                        inputType: 'year',
                        editable: true,
                        compare: 'input_last_running_mp',
                    },
                    FilterYearColumn('last_running_mp', handleSearch),
                )
            ],
        },
        {
            title: 'Last Running ASP',
            editable: true,
            children: [
                Object.assign(
                    {
                        title: 'Input',
                        dataIndex: 'input_last_running_asp',
                        width: 150,
                        compare: 'last_running_asp',
                    },
                    FilterYearColumn('input_last_running_asp', handleSearch),
                ),
                Object.assign(
                    {
                        title: 'Audit',
                        dataIndex: 'last_running_asp',
                        width: 150,
                        inputType: 'year',
                        editable: true,
                        compare: 'input_last_running_asp',
                    },
                    FilterYearColumn('last_running_asp', handleSearch),
                )
            ],
        },
        {
            title: 'Common Part Code',
            editable: true,
            children: [
                Object.assign(
                    {
                        title: 'Input',
                        dataIndex: 'input_common_part_code',
                        width: 150,
                        compare: 'common_part_code',
                    },
                    SearchColumn('input_common_part_code', handleSearch),
                ),
                Object.assign(
                    {
                        title: 'Audit',
                        dataIndex: 'common_part_code',
                        key: 'common_part_code',
                        width: 150,
                        inputType: 'text',
                        editable: true,
                        compare: 'input_common_part_code',
                    },
                    SearchColumn('common_part_code', handleSearch),
                )
            ],
        },
        Object.assign(
            {
                title: 'Asset Name',
                dataIndex: 'material_name',
                key: 'name',
                width: 250,
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
                width: 150,
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
                title: 'Future Plan',
                dataIndex: 'future_plan',
                render: (row) => (
                    [0, 1, '', null]?.includes(row) ?
                        row ? 'Yes' : 'No'
                    : '-'
                ),
                width: 140,
                selectDatas: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }],
            },
            FilterColumn('future_plan', handleSearch, [
                { text: 'Yes', value: '1' },
                { text: 'No', value: '0' },
            ]),
        ),
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
                selectDatas: customs,
            },
            FilterColumn('customs_type', handleSearch, customs),
        ),
        Object.assign(
            {
                title: 'BC Number',
                key: 'bc_number',
                dataIndex: 'bc_number',
                width: 120,
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
            },
            FilterDateColumn('bc_issue_date', handleSearch),
        ),
        {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
            width: 200,
            inputType: 'text',
            editable: true,
        },
        {
            title: 'Picture',
            width: 100,
            render: (row) => (
                row?.stock_taking_audit_image?.length ?
                    <Button style={{ background: '#673AB7', color: '#fff' }} 
                    type="default" onClick={() => handlePicture(row)}>Picture</Button>
                : null 
            )
        }
    ];

    const mergedColumns = columns.map((col) => {
        var asset_total = import.meta.env.VITE_DIRECT_VISIT_PFA
        if(location?.stock_taking?.category_id == 1) {
            asset_total = import.meta.env.VITE_DIRECT_VISIT_FA
        }

        if(asset_total < data.total
            && col.title == 'Picture'
        ) {
            return null
        }

        if (!col.editable) {
            return col;
        }
        
        if(col.editable && col.children?.length) {
            var childrens = []
            col?.children?.map((child) => {
                if (!child?.editable) {
                    childrens.push({
                        ...child,
                        onCell: (record) => (
                            {
                                style: {
                                    background: child?.compare && record[child?.compare] != record[child?.dataIndex] 
                                    ? '#e74c3c' : undefined,
                                },
                            }
                        ),
                    })
                } else {
                    childrens.push({
                        ...child,
                        onCell: (record) => ({
                            record,
                            inputType: child.inputType,
                            dataIndex: child.dataIndex,
                            title: child.title,
                            editing: isEditing(record),
                            required: child.required,
                            selectDatas: child.selectDatas,
                            style: {
                                background: child?.compare && record[child?.compare] != record[child?.dataIndex] 
                                ? '#e74c3c' : undefined,
                            },
                        }),
                    })
                }
            })

            return {
                ...col,
                children: childrens
            }
        } else {
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
                }),
            };
        }
    });

    const finish = () => {
        if(!location?.stock_taking_remark || !location?.stock_taking_remark?.audit_general_notes) {
            message.warning('Please fill the remark/suggestion before finish stock audit')
            return;
        }

        setSaving(true)
        var payload = {
            stock_taking_id: location?.stock_taking_id,
            stock_taking_location_id: location?.id,
            location_id: location?.location_id
        }

        api("POST", "stock-taking-audit/done", payload).then((res) => {
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

    const downloadTemplate = () => {
        api("GET", `stock-taking-audit/export-xls/${location?.id}`).then((res) => {
            window.open(res.data?.path)
        })
    }

    const importXls = () => {
        setModalTitle('Upload from Excel')
        setShowUpload(!showUpload)

        setAttachmentFile(null)
    }

    const saveImportXls = (v) => {
        let payload = {
            filename: attachmentFile,
        }

        if (!attachmentFile) {
            message.open({
                type: 'error',
                content: 'Please upload xlsx or csv file',
            });
        } else {
            api("POST", `stock-taking-audit/import-xls/${location?.id}`, payload).then((res) => {
                message.open({
                    type: 'success',
                    content: 'Successfully saved data',
                });
                setShowUpload(!showUpload)
                fetchData()
            }).catch((err) => {
                message.open({
                    type: 'error',
                    content: 'Failed to saving data',
                });
                setShowUpload(!showUpload)
            })
        }
        
    }

    const fileUploaded = (v) => {
        if (v.meta.success) {
            setAttachmentFile(v.data.url)
        }
    }

    const handlePicture = async (el) => {
        setShowPicture(!showPicture)
        setLoadingImg(false)

        api("GET", `stock-taking-audit/image/${el?.id}`).then(async (res) => {
            setLoadingImg(true)
            setPictures(res.data)
        })
    }

    const components = {
        body: { cell: EditableCell },
    }

    return (
        <>
            <div className="full-width mb-3">
                <Row justify="space-between">
                    <Col>
                        <Button size="middle" onClick={downloadTemplate} style={{ marginRight: 10 }}>
                            <FileExcelOutlined /> Download Template
                        </Button>

                        {location?.status_audit == 'ACTIVE' ?
                            <Button className='button-primary' size="middle" onClick={importXls}>
                                <FileExcelOutlined /> Upload from Excel
                            </Button>
                        : null }
                    </Col>
                    <Col>
                        {location.status_audit == 'ACTIVE' ? 
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

                        { location?.status_audit != 'ACTIVE' ?
                            <p>Data submitted by <b>{location?.audit_submitted_by}</b> on <b>{dayjs(location?.audit_submitted_at).format('DD MMMM YYYY HH:mm:ss')}</b></p>
                        : null }
                    </Col>
                </Row>
            </div>
            <Form form={form} component={false}>
                <Table size='small' bordered
                    components={components}
                    dataSource={datas || []} 
                    columns={mergedColumns.filter(col => col !== null)} 
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
                    search={false}
                    loading={loading}
                    pagination={{
                        total: data.total,
                        pageSize: pageSize,
                        current: paginationPage,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }} />
            </Form>

            <Modal title="Picture" open={showPicture} 
                footer={
                    <Button  className='button-primary'
                        type="primary" onClick={() => setShowPicture(!showPicture)}>
                        Close
                    </Button>
                }
                onCancel={() => setShowPicture(!showPicture)}>

                { loadingImg ?
                    <>
                        <div style={{marginBottom: '15px'}}>
                            <Carousel arrows draggable={true} infinite={true}>
                                {pictures.map((e, index) => (
                                    <div key={index}>
                                        <img src={e.image} alt={`Landscape ${index + 1}`} style={imageStyle} />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <Typography style={{marginBottom: '10px'}}>
                            Address: {pictures[0]?.address ?? "-"}<br/><br/>
                            Date: {pictures[0]?.created_at ? dayjs(pictures[0]?.created_at).format('DD MMMM YYYY HH:mm:ss') : "-"}
                        </Typography>
                        <Button className='button-primary'
                            type="primary" 
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${pictures[0]?.latitude},${pictures[0]?.longitude}`)}>
                            Show Location
                        </Button>
                    </>
                : null }
            </Modal>

            <Modal title={modalTitle} open={showUpload} 
                footer={null}
                onCancel={() => setShowUpload(!showUpload)}>
                    <Form onFinish={(e) => saveImportXls(e)}
                        form={form} layout='vertical'>
                        <Form.Item>
                            <Uploader multiple={false} dragger accept=".xlsx,.xls"
                                directory="import-excel"
                                onUploaded={(v, key) => fileUploaded(v)} 
                                isUploading={(v) => setUploading(v)}
                            />
                        </Form.Item>
                        <Space>
                            <Form.Item>
                                <Button className="button-primary" type="primary" htmlType='submit'>
                                    Submit
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => setShowUpload(!showUpload)} danger type="primary">
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