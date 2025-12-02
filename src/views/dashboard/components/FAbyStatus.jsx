import React, { useEffect, useState } from 'react'
import { 
    Card,
    Table,
    Tag,
    Modal
} from 'antd'
import { Column } from '@ant-design/plots'
import { api } from '@/api'
import { SearchColumn, FilterColumn, FilterYearColumn } from "@/common/SearchColumn";

const FAbyStatus = () => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState([])
    const [summaries, setSummaries] = useState([])
    const [datas, setDatas] = useState([])
    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState(null)
    const [classCode, setClassCode] = useState(null)
    const [paginationPage, setPaginationPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchData = () => {
        setLoading(true)
        api("GET", `dashboard/summary-by-asset-class?category=FA`).then((res) => {
            var tempData = []
            res.data?.datas?.map((e) => {
                tempData.push({
                    name: 'Internal',
                    type: e.class_name,
                    value: parseFloat(e.internal),
                })

                tempData.push({
                    name: 'External',
                    type: e.class_name,
                    value: parseFloat(e.external),
                })
            })
            
            setSummaries(tempData)
            setSummary(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    const barData = {
        data: summaries,
        isGroup: true,
        xField: "type",
        yField: "value",
        seriesField: "name",
        label: {
            position: "top",
            layout: [
                { type: "interval-adjust-position" }, 
                { type: "interval-hide-overlap" }, 
                { type: "adjust-color" },
            ],
        },
        xAxis: {
            label: {
                rotate: -45,
                position: "left",
                offset: 30,
            }
        }
    };

    const handleShowAsset = (class_code, category) => {
        setShowModal(!showModal)
        setLoading(true)
        setClassCode(class_code)
        setCategory(category)

        api("GET", `dashboard/assets?type=${category}&category=1&params=class_code&value=${class_code}`).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const handleChangePagination = (el) => {
        setLoading(true)
        api("GET", `dashboard/assets?type=${category}&category=1&params=class_code&value=${classCode}&page=${el.current}&limit=${el.pageSize}`).then((res) => {
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
            value: Object.values(el),
            type: category,
            class_code: classCode,
            category: 1
        }
        api("GET", `dashboard/assets`, payload).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            render: (text, row, index) => index + 1,
            align: 'center',
            width: 50,
        },
        {
            title: 'Asset Class',
            dataIndex: 'class_name',
            key: 'class_name',
            align: 'center',
        },
        {
            title: summary?.stock_taking?.name,
            children: [
                {
                    title: 'Internal',
                    width: 150,
                    render: (row) => {
                        return <a onClick={() => handleShowAsset(row.class_code,'INTERNAL')}>{row.internal}</a>
                    }
                },
                {
                    title: 'External',
                    width: 150,
                    render: (row) => {
                        return <a onClick={() => handleShowAsset(row.class_code,'EXTERNAL')}>{row.external}</a>
                    }
                },
            ],
        },
    ]

    const column_assets = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            align: 'center',
            render: (text, record, index) => (
                `${(parseFloat((paginationPage-1) * pageSize) + parseFloat(index+1))}`
            ),
        },
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
                title: 'Asset Number',
                dataIndex: 'asset_number',
                key: 'asset_number',
                fixed: 'left',
                width: 150,
            },
            SearchColumn('asset_number', handleSearch),
        ),
        Object.assign(
            {
                title: 'Asset Name',
                dataIndex: 'material_name',
                key: 'material_name',
                width: 200,
            },
            SearchColumn('material_name', handleSearch),
        ),
        Object.assign(
            {
                title: 'Asset Class',
                dataIndex: 'class_name',
                key: 'asset_class',
                width: 150,
            },
            SearchColumn('class_name', handleSearch),
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
                title: 'Part Code',
                dataIndex: 'material_code',
                key: 'part_code',
                width: 150,
            },
            SearchColumn('material_code', handleSearch),
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
                dataIndex: 'common_part',
                key: 'common_part',
                width: 100,
            },
            SearchColumn('common_part', handleSearch),
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
                title: 'BC Number',
                dataIndex: 'bc_number',
                key: 'bc_number',
                width: 100,
            },
            SearchColumn('bc_number', handleSearch),
        ),
        Object.assign(
            {
                title: 'BC Issue Date',
                dataIndex: 'bc_issue_date',
                key: 'bc_issue_date',
                width: 150,
            },
            SearchColumn('bc_issue_date', handleSearch),
        ),
    ];

    return (
        <>
            <Card
                title={`Fixed Asset - by Asset Class (${summary?.stock_taking?.name ?? ''})`}
                style={{
                    marginBottom: 20,
                }}
            >
                { !loading ?
                    <Column {...barData} />
                : null }
            </Card>

            <Card 
                title={`Fixed Asset - by Asset Class (${summary?.stock_taking?.name ?? ''})`}
                style={{
                    marginBottom: 20,
                }}
                >
                <Table 
                    size='small' 
                    bordered 
                    dataSource={summary.datas} 
                    rowClassName="editable-row"
                    loading={loading}
                    columns={columns}
                    pagination={false}
                />
            </Card>

             <Modal title="Fixed Asset - by Asset Class" open={showModal} 
                footer={null}
                width={1200}
                onCancel={() => setShowModal(!showModal)}>
                    <Table size='small' bordered 
                        dataSource={datas} 
                        columns={column_assets} 
                        scroll={{ 
                            x: 900,
                            scrollToFirstRowOnChange: false 
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
            </Modal>
        </>
    )
}

export default FAbyStatus