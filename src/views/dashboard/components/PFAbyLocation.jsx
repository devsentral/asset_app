import React, { useEffect, useState } from 'react'
import { 
    Card, 
    Table, 
} from 'antd'
import { api } from '@/api'

const PFAbyLocation = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])

    const fetchData = () => {
        setLoading(true)
        api("GET", `dashboard/stock-taking-summary?category=PFA_FIXED_ASSET`).then((res) => {
            setData(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);
    
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
    
    const columns2 = [
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
            title: 'Grand Total',
            dataIndex: 'mistake_total',
            key: 'mistake_total',
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        },
    ]

    return (
        <>
            <Card 
                title={`Summary over all Stock Taking result - (${data?.stock_taking?.name ?? ''})`}
                style={{
                    marginBottom: 20,
                }}
                >
                <Table 
                    size='small' 
                    bordered 
                    dataSource={data?.domestic} 
                    rowClassName="editable-row"
                    loading={loading}
                    columns={columns}
                    pagination={false}
                />
            </Card>

            <Card 
                title={`Discrepancy - (${data?.stock_taking?.name ?? ''})`}
                style={{
                    marginBottom: 20,
                }}
                >
                <Table 
                    size='small' 
                    bordered 
                    dataSource={data.domestic} 
                    rowClassName="editable-row"
                    loading={loading}
                    columns={columns2}
                    pagination={false}
                />
            </Card>
        </>
    )
}

export default PFAbyLocation