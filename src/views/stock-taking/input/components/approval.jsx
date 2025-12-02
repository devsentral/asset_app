import React, { useEffect, useState } from 'react'
import { Card, Table, Col, Row, Popconfirm, Button, message } from 'antd'
import { api, authUser } from '@/api'
import { CheckOutlined } from '@ant-design/icons'
import moment from 'moment'

const Approval = (props) => {
    const { data } = props
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [datas, setDatas] = useState([])

    const fetchData = () => {
        api("GET", `stock-taking-asset/approval/${data?.id}`).then((res) => {
            setDatas(res.data)
            setLoaded(true)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            align: 'center',
            width: 100,
        },
        {
            title: 'User Id',
            dataIndex: 'user_id',
            align: 'center',
            width: 100,
        },
        {
            title: 'Start',
            render: (row) => (
                row.start_date ? moment(row.start_date).format('YYYY-MM-DD HH:mm:ss') : '-'
            ),
            align: 'center',
            width: 100,
        },
        {
            title: 'End',
            render: (row) => (
                row.end_date ? moment(row.end_date).format('YYYY-MM-DD HH:mm:ss') : '-'
            ),
            align: 'center',
            width: 100,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
            width: 100,
        },
    ];

    const approve = () => {
        setSaving(true)
        var payload = {
            stock_taking_id: data.stock_taking_id,
            stock_taking_location_id: data.id,
            location_id: data.location_id
        }

        api("POST", "stock-taking-asset/approve", payload).then((res) => {
            setSaving(false)
            message.success('Successfully saved data')
            fetchData()
        }).catch((err) => {
            setSaving(false)
            message.warning('Failed to saving data')
        })
    }

    return (
        <Card className="content-container">
            <div className="full-width mb-3">
                <Row justify="space-between">
                    <Col></Col>
                    <Col>
                        {datas.find((e) => e.user_id == authUser.preferred_username && e.status == 'ON PROGRESS') ?
                            <Popconfirm
                                title="Are you sure to approve stock taking ?"
                                onConfirm={approve}
                                onCancel={(e) => console.log(e)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button className='button-primary' loading={saving} size="middle" type="primary" icon={<CheckOutlined />}>
                                    Approve
                                </Button>
                            </Popconfirm>
                        : null }
                    </Col>
                </Row>
            </div>
            <Table scroll={{ x: 900 }} 
                bordered
                dataSource={datas} 
                columns={columns} 
                size='small' 
                pagination={false} 
            />
        </Card>
    )
}

export default Approval