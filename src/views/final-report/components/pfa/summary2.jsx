import { useEffect, useState } from 'react'
import { Card, Table } from "antd"
import { api } from '@/api'

const Summary2 = ({stockTakingId}) => {
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState([]);

    const fetchData = () => {
        setLoading(true)
        api("GET", `final-report/summary/${stockTakingId}?type=DOMESTIC`).then((res) => {
            setDatas(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, [stockTakingId]);

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
            title: 'Asset Location',
            dataIndex: 'location_name',
            key: 'location_name',
            align: 'center',
        },
        {
            title: 'Lost',
            dataIndex: 'mistake_lost',
            key: 'mistake_lost',
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        },
        {
            title: 'Mistake Data +',
            dataIndex: 'mistake_plus',
            key: 'mistake_plus',
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        },
        {
            title: 'Total Qty',
            dataIndex: 'mistake_total',
            key: 'mistake_total',
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        },
    ]

    return (
        <Card 
            title="Discrepancy"
            style={{
                marginBottom: 20,
            }}
            >
            <Table 
                size='small' 
                bordered 
                dataSource={datas} 
                rowClassName="editable-row"
                loading={loading}
                columns={columns}
                pagination={false}
            />
        </Card>
    )
}

export default Summary2