import React, { useEffect, useState } from 'react'
import { 
    Card, 
    Table, 
    Col, 
    Row,
    Button
} from 'antd'
import { api } from '@/api'

import FAbyLocation from './FAbyLocation'
import PFAbyLocation from './PFAbyLocation'

const Summary = () => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState([])
    const [tabsKey, setTabsKey] = useState('FA_FIXED_ASSET')

    const fetchData = (el) => {
        setLoading(true)
        api("GET", `dashboard/stock-taking-summary?category=${el}`).then((res) => {
            setSummary(res.data)
            setLoading(false)
        })
    }

    const handleFilter = (type) => {
        setLoading(true)
        fetchData(type)
        setTabsKey(type)
    }

    useEffect(() => {
        fetchData(tabsKey)
    }, [tabsKey]);

    const columns = [
        {
            title: 'Asset Type',
            dataIndex: 'name',
            align: 'center',
            width: 100,
        },
        {
            title: 'Ledger',
            dataIndex: 'total',
            align: 'center',
            width: 100,
        },
        {
            title: 'Found',
            dataIndex: 'found',
            align: 'center',
            width: 100,
        },
        {
            title: 'Transfer',
            dataIndex: 'transfer',
            align: 'center',
            width: 100,
        },
        {
            title: 'Disposed',
            dataIndex: 'disposed',
            align: 'center',
            width: 100,
        },
        {
            title: 'Lost',
            dataIndex: 'lost',
            align: 'center',
            width: 100,
        },
        {
            title: 'Additional Asset',
            dataIndex: 'additional',
            align: 'center',
            width: 100,
        },
    ];

    const columns_labelling = [
        {
            title: 'Label',
            dataIndex: 'name',
            align: 'center',
            width: 100,
        },
        {
            title: 'Ledger',
            dataIndex: 'total',
            align: 'center',
            width: 100,
        },
    ];

    const columns_usage = [
        {
            title: 'Usage',
            dataIndex: 'name',
            align: 'center',
            width: 100,
        },
        {
            title: 'Ledger',
            dataIndex: 'total',
            align: 'center',
            width: 100,
        },
    ];

    const columns_condition = [
        {
            title: 'Condition',
            dataIndex: 'name',
            align: 'center',
            width: 100,
        },
        {
            title: 'Ledger',
            dataIndex: 'total',
            align: 'center',
            width: 100,
        },
    ];

    return (

        <Card 
            style={{ marginLeft: 50, marginRight: 50, marginTop: 10 }}
            title={
                <div className="full-width">
                    <Row justify="space-between">
                        <Col>
                            { tabsKey == 'FA_FIXED_ASSET' ?
                                <Button onClick={() => handleFilter('FA_FIXED_ASSET')} style={{ borderRadius: 0, background: '#673AB7', color: '#fff' }} type="default">
                                    FA Stock Taking Result - by Location
                                </Button>
                            : <Button onClick={() => handleFilter('FA_FIXED_ASSET')} style={{ borderRadius: 0 }} type="default">
                                FA Stock Taking Result - by Location
                            </Button> }

                            { tabsKey == 'PFA_FIXED_ASSET' ?
                                <Button onClick={() => handleFilter('PFA_FIXED_ASSET')} style={{ borderRadius: 0, background: '#673AB7', color: '#fff' }} type="default">
                                    PFA Stock Taking Result - by Location
                                </Button>
                            : <Button onClick={() => handleFilter('PFA_FIXED_ASSET')} style={{ borderRadius: 0 }} type="default">
                                PFA Stock Taking Result - by Location
                            </Button> }
                            
                            { tabsKey == 'FA_FIXED_ASSET_CLASS' ?
                                <Button onClick={() => handleFilter('FA_FIXED_ASSET_CLASS')} style={{ borderRadius: 0, background: '#673AB7', color: '#fff' }} type="default">
                                    FA Stock Taking Result - by Asset Class
                                </Button>
                            : <Button onClick={() => handleFilter('FA_FIXED_ASSET_CLASS')} style={{ borderRadius: 0 }} type="default">
                                FA Stock Taking Result - by Asset Class
                            </Button> }

                            { tabsKey == 'PFA_FIXED_ASSET_CLASS' ?
                                <Button onClick={() => handleFilter('PFA_FIXED_ASSET_CLASS')} style={{ borderRadius: 0, background: '#673AB7', color: '#fff' }} type="default">
                                    PFA Stock Taking Result - by Asset Class
                                </Button>
                            : <Button onClick={() => handleFilter('PFA_FIXED_ASSET_CLASS')} style={{ borderRadius: 0 }} type="default">
                                PFA Stock Taking Result - by Asset Class
                            </Button> }
                            
                        </Col>
                    </Row>
                </div>
            }
        >
            
            { tabsKey == 'FA_FIXED_ASSET' ?
                <FAbyLocation />
            : null }

            { tabsKey == 'PFA_FIXED_ASSET' ?
                <PFAbyLocation />
            : null }

            { tabsKey == 'FA_FIXED_ASSET_CLASS' ?
                <Card 
                    title={`Summary over all Stock Taking result - (${summary?.stock_taking?.name})`}>

                    <Table scroll={{ x: 900 }} 
                        bordered
                        dataSource={summary?.results} 
                        columns={columns} 
                        size='small' 
                        loading={loading}
                        pagination={false} 
                    />

                    <Row justify="space-between" className="mt-3" style={{ marginTop: 20}}>
                        <Col span={8}>
                            <div className="full-width mb-3">
                                <Row justify="left">
                                    <strong>Labelling Summary:</strong>
                                </Row>
                            </div>
                            <Table
                                bordered
                                dataSource={summary.labellings} 
                                columns={columns_labelling} 
                                size='small' 
                                loading={loading}
                                pagination={false} 
                            />
                        </Col>
                        <Col span={8}>
                            <div className="full-width mb-3">
                                <Row justify="left">
                                    <strong>Idle Summary:</strong>
                                </Row>
                            </div>
                            <Table
                                bordered
                                dataSource={summary.usages} 
                                columns={columns_usage} 
                                size='small' 
                                loading={loading}
                                pagination={false} 
                            />
                        </Col>
                        <Col span={7}>
                            <div className="full-width mb-3">
                                <Row justify="left">
                                    <strong>Condition Summary:</strong>
                                </Row>
                            </div>
                            <Table
                                bordered
                                dataSource={summary.conditions} 
                                columns={columns_condition} 
                                size='small' 
                                loading={loading}
                                pagination={false} 
                            />
                        </Col>
                    </Row>
                </Card>
            : null }

            { tabsKey == 'PFA_FIXED_ASSET_CLASS' ?
                <Card 
                    title={`Summary over all Stock Taking result - (${summary?.stock_taking?.name})`}>

                    <Table scroll={{ x: 900 }} 
                        bordered
                        dataSource={summary?.results} 
                        columns={columns} 
                        size='small' 
                        loading={loading}
                        pagination={false} 
                    />

                    <Row justify="space-between" className="mt-3" style={{ marginTop: 20}}>
                        <Col span={8}>
                            <div className="full-width mb-3">
                                <Row justify="left">
                                    <strong>Labelling Summary:</strong>
                                </Row>
                            </div>
                            <Table
                                bordered
                                dataSource={summary.labellings} 
                                columns={columns_labelling} 
                                size='small' 
                                loading={loading}
                                pagination={false} 
                            />
                        </Col>
                        <Col span={8}>
                            <div className="full-width mb-3">
                                <Row justify="left">
                                    <strong>Idle Summary:</strong>
                                </Row>
                            </div>
                            <Table
                                bordered
                                dataSource={summary.usages} 
                                columns={columns_usage} 
                                size='small' 
                                loading={loading}
                                pagination={false} 
                            />
                        </Col>
                        <Col span={7}>
                            <div className="full-width mb-3">
                                <Row justify="left">
                                    <strong>Condition Summary:</strong>
                                </Row>
                            </div>
                            <Table
                                bordered
                                dataSource={summary.conditions} 
                                columns={columns_condition} 
                                size='small' 
                                loading={loading}
                                pagination={false} 
                            />
                        </Col>
                    </Row>
                </Card>
            : null }

        </Card>
    )
}

export default Summary