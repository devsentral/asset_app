import { useEffect, useState } from 'react'
import { Card, Table } from "antd"
import { api } from '@/api'

const Summary1 = ({stockTakingId}) => {
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
            title: 'Qty By Ledger',
            dataIndex: 'qty_ledger',
            key: 'qty_ledger',
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        },
        {
            title: 'Qty By Actual',
            dataIndex: 'qty_actual',
            key: 'qty_actual',
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        },
    ]

    return (
        <Card 
            title="Summary over all Stock Taking result"
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

export default Summary1