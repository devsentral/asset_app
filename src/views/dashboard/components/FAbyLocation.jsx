import React, { useEffect, useState } from 'react'
import { 
    Card, 
    Table, 
} from 'antd'
import { api } from '@/api'

const FAbyLocation = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])

    const fetchData = () => {
        setLoading(true)
        api("GET", `dashboard/stock-taking-summary?category=FA_FIXED_ASSET`).then((res) => {
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
        {
            title: 'Mistake Data',
            children: [
                {
                    title: '+',
                    dataIndex: 'mistake_plus',
                    key: 'mistake_plus',
                    width: 50,
                    align: 'center',
                    render: (row) => {
                        return row?.toLocaleString('id-ID')
                    }
                },
                {
                    title: '-',
                    dataIndex: 'mistake_minus',
                    key: 'mistake_minus',
                    width: 50,
                    align: 'center',
                    render: (row) => {
                        return row?.toLocaleString('id-ID')
                    }
                },
            ]
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
            title: 'Total',
            dataIndex: 'mistake_total',
            key: 'mistake_total',
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        },
        {
            title: 'Acq Value By Ledger',
            dataIndex: 'acq_value_ledger',
            key: 'acq_value_ledger',
            render: (row) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row)
            },
        },
        {
            title: 'Acq Value By Actual',
            dataIndex: 'acq_value_actual',
            key: 'acq_value_actual',
            render: (row) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row)
            },
        },
        {
            title: 'Discrepancy',
            dataIndex: 'discrepancy',
            key: 'discrepancy',
            render: (row) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row)
            },
        },
        {
            title: 'Book Value',
            dataIndex: 'book_value',
            key: 'book_value',
            render: (row) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row)
            },
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
                title={`Summary over all Stock Taking result - (${data?.stock_taking?.name ?? ''})`}
                style={{
                    marginBottom: 20,
                }}
                >
                <Table 
                    size='small' 
                    bordered 
                    dataSource={data.overseas} 
                    rowClassName="editable-row"
                    loading={loading}
                    columns={columns}
                    pagination={false}
                />
            </Card>
        </>
    )
}

export default FAbyLocation