import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
    Card,  
    Tag, 
    Row,
    Col,
    Button,
    Popconfirm,
    Table,
    message } from 'antd'
import Breadcrumb from "@/common/Breadcrumb";
import { SearchColumn, FilterColumn, FilterYearColumn, FilterDateColumn } from "@/common/SearchColumn";
import { api } from '@/api'
import { roleAccess } from '@/helpers/menu'

import HeaderLayout from '@/layouts/Header';

const StockList = () => {
    const { stockTakingId } = useParams()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false);
    const [datas, setDatas] = useState([]);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([])
    const [results, setResults] = useState([])
    const [customs, setCustoms] = useState([])
    const [stockTaking, setStockTaking] = useState([])
    const [paginationPage, setPaginationPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchStockTaking = () => {
        api("GET", `stock-taking/${stockTakingId}`).then((res) => {
            setStockTaking(res.data)
        })
    }

    const fetchData = () => {
        setLoading(true)
        api("GET", `stock-lists/${stockTakingId}`).then((res) => {
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

    useEffect(() => {
        fetchData()
        fetchStockTaking()
        fetchCategory()
        fetchResult()
        fetchCustomsType()
    }, []);

    const generateStockList = () => {
        setSaving(true)
        api("POST", `stock-list/generate/${stockTakingId}`).then((res) => {
            fetchData()
            message.success('Successfully generate stock list')
            setSaving(false)
        })
    }

    const transferToAstro = () => {
        setSaving(true)
        api("POST", `stock-list/transfer/${stockTakingId}`).then((res) => {
            fetchData()
            message.success('Successfully transfer asset to ASTRO')
            setSaving(false)
        })
    }

    const downloadDiscrepancyList = () => {
        setSaving(true)
        api("GET", `stock-list/download-discrepancy/${stockTakingId}`).then((res) => {
            window.open(res.data?.path)
            setSaving(false)
        })
    }

    const handleChangePagination = (el) => {
        setLoading(true)
        api("GET", `stock-lists/${stockTakingId}?page=${el.current}&limit=${el.pageSize}`).then((res) => {
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
        api("GET",  `stock-lists/${stockTakingId}`, payload).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const columns = [
        Object.assign(
            {
                title: 'Asset Id',
                dataIndex: 'asset_id',
                key: 'asset_id',
                width: 100,
                align: 'center'
            },
            SearchColumn('asset_id', handleSearch),
        ),
        Object.assign(
            {
                title: 'Part Code',
                dataIndex: 'material_code',
                key: 'part_code',
                fixed: 'left',
                width: 150,
            },
            SearchColumn('material_code', handleSearch),
        ),
        Object.assign(
            {
                title: 'Asset Description',
                dataIndex: 'material_name',
                key: 'material_name',
                width: 200,
            },
            SearchColumn('material_name', handleSearch),
        ),
        Object.assign(
            {
                title: 'Asset Number',
                dataIndex: 'asset_number',
                key: 'asset_number',
                width: 150,
            },
            SearchColumn('asset_number', handleSearch),
        ),
        Object.assign(
            {
                title: 'ParentId',
                dataIndex: 'asset_parent_id',
                key: 'asset_parent_id',
                width: 150,
            },
            // SearchColumn('asset_parent_id', handleSearch),
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
                title: 'Asset Category',
                key: 'category',
                dataIndex: 'category_id',
                render: (row) => (
                    categories?.find((e) => e.value == row)?.text
                ),
                width: 120,
                selectDatas: categories,
            },
            FilterColumn('category_id', handleSearch, categories),
        ),
        Object.assign(
            {
                title: 'Asset Class Code',
                dataIndex: 'class_code',
                key: 'class_code',
                width: 150,
            },
            SearchColumn('class_code', handleSearch),
        ),
        Object.assign(
            {
                title: 'Asset Class Name',
                dataIndex: 'class_name',
                key: 'class_name',
                width: 150,
            },
            SearchColumn('class_name', handleSearch),
        ),
        Object.assign(
            {
                title: 'Location',
                dataIndex: 'location_name',
                key: 'location_name',
                width: 200,
                required: true,
            },
            SearchColumn('location_name', handleSearch),
        ),
        Object.assign(
            {
                title: 'Details Location',
                dataIndex: 'detail_location',
                key: 'detail_location',
                width: 200,
                required: true,
            },
            SearchColumn('detail_location', handleSearch),
        ),
        Object.assign(
            {
                title: 'PIC',
                dataIndex: 'pic',
                key: 'pic',
                width: 100,
                required: true,
            },
            SearchColumn('pic', handleSearch),
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
                    row != '' ?
                        <Tag color={row ? "green" : "red"}>{row ? 'Done' : 'Undone'}</Tag>
                    : '-'
                ),
                width: 100,
            },
            FilterColumn('facs', handleSearch, [
                { text: 'Done', value: '1' },
                { text: 'Undone', value: '0' },
            ]),
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
                    row != '' ?
                        <Tag color={row ? "green" : "red"}>{row ? 'Yes' : 'No'}</Tag>
                    : '-'
                ),
                width: 100,
            },
            FilterColumn('sticker', handleSearch, [
                { text: 'Yes', value: '1' },
                { text: 'No', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Plate',
                dataIndex:'plate',
                render: (row) => (
                    row != '' ?
                        <Tag color={row ? "green" : "red"}>{row ? 'Complete' : 'Incomplete'}</Tag>
                    : '-'
                ),
                width: 100,
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
                    row != '' ?
                        <Tag color={row ? "green" : "red"}>{row ? 'Used' : 'Idle'}</Tag>
                    : '-'
                ),
                width: 100,
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
                    row != '' ?
                        <Tag color={row ? "green" : "red"}>{row ? 'Good' : 'Broken'}</Tag>
                    : '-'
                ),
                width: 100,
            },
            FilterColumn('condition', handleSearch, [
                { text: 'Good', value: '1' },
                { text: 'Broken', value: '0' },
            ]),
        ),
        Object.assign(
            {
                title: 'Last Running MP',
                dataIndex: 'last_running_mp',
                key: 'last_running_mp',
                width: 150,
            },
            FilterYearColumn('last_running_mp', handleSearch),
        ),
        Object.assign(
            {
                title: 'Last Running ASP',
                dataIndex: 'last_running_asp',
                key: 'last_running_asp',
                width: 150,
            },
            FilterYearColumn('last_running_asp', handleSearch),
        ),
        Object.assign(
            {
                title: 'Common Part Code',
                dataIndex: 'common_part_code',
                key: 'common_part_code',
                width: 100,
            },
            SearchColumn('common_part_code', handleSearch),
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
                title: 'Book Value',
                dataIndex: 'book_value',
                key: 'book_value',
                width: 100,
            },
            SearchColumn('book_value', handleSearch),
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

    return (
        <div>
            <HeaderLayout stockTake={stockTaking}/>

            {/* Breadcrumb */}
            <Breadcrumb mainTitle="Stock List"/>

            <Row>
                <Col xs={24} className="gutter-row">
                    <Card className="content-container">
                        <div className="full-width mb-3">
                            <Row justify="space-between">
                                <Col>
                                    { roleAccess('stock list add') ?
                                        <Popconfirm
                                            title="Are you sure generate stock list ?"
                                            onConfirm={generateStockList}
                                            onCancel={(e) => console.log(e)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button className='button-primary' size="middle" 
                                                type="primary" loading={saving}
                                                style={{ marginRight: 10 }}>
                                                Generate Stock List
                                            </Button>
                                        </Popconfirm>
                                    : null }
                                    { roleAccess('stock list add') ?
                                        <Popconfirm
                                            title="Are you sure transfer data to ASTRO ?"
                                            onConfirm={transferToAstro}
                                            onCancel={(e) => console.log(e)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button className='button-primary' size="middle" 
                                                type="primary" loading={saving}
                                                style={{ marginRight: 10 }}>
                                                Transfer to ASTRO
                                            </Button>
                                        </Popconfirm>
                                    : null }
                                    { roleAccess('stock list add') ?
                                        <Button className='button-primary' size="middle" 
                                            type="primary" loading={saving}
                                            onClick={downloadDiscrepancyList}
                                            style={{ marginRight: 10 }}>
                                            Download Discrepancy List
                                        </Button>
                                    : null }
                                </Col>
                                <Col>

                                </Col>
                            </Row>
                        </div>
                        <Card>
                            <Table size='small' bordered 
                                dataSource={datas} 
                                columns={columns} 
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
                        </Card>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default StockList