import React, { useEffect, useState } from 'react'
import { Card, Table, Col, Row } from 'antd'
import { api } from '@/api'

const PFASummary = () => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState([])

    const fetchData = () => {
        setLoading(true)
        api("GET", `dashboard/stock-taking-summary?category=PFA`).then((res) => {
            setSummary(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

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
            title={`Summary over all Stock Taking result - Pre-Fixed Asset (${summary?.stock_taking?.name})`}
            style={{ marginLeft: 50, marginRight: 50, marginTop: 20 }}>

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
    )
}

export default PFASummary