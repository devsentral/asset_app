import React, { useEffect, useState } from 'react'
import { Card, Table, Col, Row, Button } from 'antd'
import { api } from '@/api'
import { FilePdfOutlined } from '@ant-design/icons';
import moment from 'moment';

const Summary = (props) => {
    const { data } = props
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [summary, setSummary] = useState([])

    const fetchData = () => {
        setLoading(true)
        api("GET", `stock-taking-asset/summary/${data?.id}`).then((res) => {
            setSummary(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    const downloadPdfReport = () => {
        setDownloading(true)
        api("GET", `stock-taking-asset/summary/download-pdf/${data?.id}`).then((res) => {
            window.open(res.data?.path)
            setDownloading(false)
        })
    }

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
        <Card className="content-container">

            <div className="full-width mb-1">
                <Row justify="space-between">
                    <Col>
                        {data?.status_input == 'DONE' ?
                            <Button size="middle" onClick={downloadPdfReport} 
                                loading={downloading}
                                style={{ marginRight: 10, background: '#f5222d', color: 'white' }}>
                                <FilePdfOutlined /> Download PDF Report
                            </Button>
                        : null }
                    </Col>
                    <Col>
                        { data?.status_input != 'ACTIVE' ?
                            <p>Data submitted by <b>{data?.input_submitted_by}</b> on <b>{moment(data?.input_submitted_at).format('DD MMMM YYYY HH:mm:ss')}</b></p>
                        : null }
                    </Col>
                </Row>
            </div>

            <div className="full-width mb-3">
                <Row justify="left">
                    <strong>Result Summary:</strong>
                </Row>
            </div>
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

export default Summary