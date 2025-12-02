import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Table, Row, Col, Button, Progress, Popconfirm, message } from 'antd'
import { api } from '@/api'
import Breadcrumb from "@/common/Breadcrumb";
import { SearchColumn } from "@/common/SearchColumn";
import { roleAccess } from '@/helpers/menu'

import HeaderLayout from '@/layouts/Header';

const StockTakingPreview = () => {
    const { stockTakingId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingCreateSample, setLoadingCreateSample] = useState(false)
    const [datas, setDatas] = useState([])
    const [data, setData] = useState([])
    const [paginationPage, setPaginationPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [stockTaking, setStockTaking] = useState([])
    const [tabsKey, setTabsKey] = useState('INTERNAL')

    const fetchStockTaking = () => {
        setLoading(true)
        api("GET", `stock-taking/${stockTakingId}`).then((res) => {
            setStockTaking(res.data)
            setLoading(false)
        })
    }

    const fetchData = () => {
        setLoading(true)
        api("GET", `stock-taking-locations/${stockTakingId}?type=INTERNAL`).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
    }

    const handleFilter = (type) => {
        setLoading(true)
        api("GET", `stock-taking-locations/${stockTakingId}?type=${type}`).then((res) => {
            setDatas(res.data?.data)
            setData(res.data)
            setLoading(false)
        })
        setTabsKey(type)
    }

    useEffect(() => {
        fetchData()
        fetchStockTaking()
    }, []);

    const handleChangePagination = (el) => {
        setLoading(true)
        api("GET", `stock-taking-locations/${stockTakingId}?page=${el.current}&limit=${el.pageSize}`).then((res) => {
            setDatas(res.data?.data)
            setData(res?.data)
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
            type: tabsKey
        }
        api("GET",  `stock-taking-locations/${stockTakingId}`, payload).then((res) => {
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
                key: 'name',
                fixed: 'left',
                width: 300,
            },
            SearchColumn('location_name', handleSearch),
        ),
        {
            title: 'Input Stock Take',
            key: 'name',
            render: (row) => (
                <Button style={{ background: '#673AB7', color: '#fff' }} type="default" onClick={() => navigate(`/stock-taking/input/${row.id}`)}>Open</Button>
            ),
            width: 150,
            align: 'center'
        },
        {
            title: 'Progress Inputted',
            key: 'category',
            render: (row) => (
                <>
                    <Row>
                        <Col span={4}>{row.taking_progress_qty}</Col>
                        <Col span={16}>{row.taking_percentage}%</Col>
                        <Col span={4}>{row.taking_total_qty}</Col>
                    </Row>
                    <Progress percent={parseFloat(row.taking_percentage)} showInfo={false} status="active" strokeColor={{ from: '#673AB7', to: '#673AB7' }}/>
                </>
            ),
            width: 250,
            align: 'center'
        },
        {
            title: 'Progress Audited',
            key: 'category',
            render: (row) => (
                <>
                    {row.status_input == 'DONE' && !row.is_audited && roleAccess('stock audit add') ?
                        <Popconfirm
                            title="Are you sure to create sample audit ?"
                            onConfirm={() => createSampleAudit(row)}
                            onCancel={(e) => console.log(e)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button loading={loadingCreateSample} style={{ background: '#34495e', color: '#fff' }} type="default">
                                Create Sample Audit
                            </Button>
                        </Popconfirm>
                    : null}

                    {(row.status_input != 'DONE') ?
                        <Button style={{ background: '#bdc3c7', color: '#fff' }} type="default" disabled>Create Sample Audit</Button>
                    : null }
                    
                    {row.is_audited ?
                        <>
                            <Row>
                                <Col span={4}>{row.audit_progress_qty}</Col>
                                <Col span={16}>{row.audit_percentage}%</Col>
                                <Col span={4}>{row.audit_total_qty}</Col>
                            </Row>
                            <Progress percent={parseFloat(row.audit_percentage)} showInfo={false} status="active" strokeColor={{ from: '#673AB7', to: '#673AB7' }}/>
                        </>
                    : null}
                </>
            ),
            width: 250,
            align: 'center'
        },
        {
            title: 'Audit Stock Take',
            key: 'name',
            render: (row) => (
                (row.is_audited) ?
                    <Button style={{ background: '#673AB7', color: '#fff' }} type="default" onClick={() => navigate(`/stock-taking/audit/${row.id}`)}>Open</Button>
                : <Button style={{ background: '#bdc3c7', color: '#fff' }} type="default" disabled>Open</Button>
            ),
            width: 150,
            align: 'center'
        },
        
        {
            title: 'Total Stock Take',
            key: 'start_date',
            fixed: 'right',
            render: (row) => (
                row.taking_total_qty
            ),
            align: 'center',
            width: 150
        },
    ];

    const createSampleAudit = (el) => {
        setLoadingCreateSample(true)
        var payload = {
            stock_taking_id: el.stock_taking_id
        }

        api("POST", `stock-taking-location/create-sample-audit/${el.id}`, payload).then((res) => {
            message.success('Successfully create sample audit')
            setLoadingCreateSample(false)

            fetchData()
        }).catch((err) => {
            setLoadingCreateSample(false)
            message.warning('Failed to create sample audit')
        })
    }


    return (
        <div>
            <HeaderLayout stockTake={stockTaking}/>

            {/* Breadcrumb */}
            <Breadcrumb pageTitle="Progress Stock Take per Location" />

            <Card className="content-container">
                <Card 
                    title={
                        <div className="full-width">
                            <Row justify="space-between">
                                <Col>
                                </Col>
                                <Col>
                                    { tabsKey == 'INTERNAL' ?
                                        <Button onClick={() => handleFilter('INTERNAL')} style={{ borderRadius: 0, background: '#673AB7', color: '#fff' }} type="default">INTERNAL</Button>
                                    : <Button onClick={() => handleFilter('INTERNAL')} style={{ borderRadius: 0 }} type="default">INTERNAL</Button> }
                                    { tabsKey == 'EXTERNAL' ?
                                        <Button onClick={() => handleFilter('EXTERNAL')} style={{ borderRadius: 0, background: '#673AB7', color: '#fff' }} type="default">EXTERNAL</Button>
                                    : <Button onClick={() => handleFilter('EXTERNAL')} style={{ borderRadius: 0 }} type="default">EXTERNAL</Button> }
                                </Col>
                            </Row>
                        </div>
                    }
                >

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
        </div>
    )
}

export default StockTakingPreview