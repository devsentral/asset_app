import { useEffect, useState } from 'react'
import { Card, Table } from 'antd'
import { api } from '@/api'

const AssetClass = ({stockTakingId}) => {
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState([]);
    const [assetClassColumns, setAssetClassColumns] = useState([]);

    const fetchData = () => {
        setLoading(true)
        api("GET", `final-report/by-asset-class/${stockTakingId}`).then((res) => {
            setDatas(res.data)
            setLoading(false)
        })
    }

    const fetchAssetClassColumn = () => {
        setLoading(true)
        api("GET", `final-report/by-asset-class-column/${stockTakingId}`).then((res) => {
            setAssetClassColumns(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
        fetchAssetClassColumn()
    }, [stockTakingId]);

    var assetClassColumn = []
    assetClassColumns.map((item) => {
        assetClassColumn.push({
            title: item.class_name,
            dataIndex: item.class_code,
            key: item.class_code,
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        })
    })

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
        },
        {
            title: 'Asset Class',
            children: assetClassColumn
        },
        {
            title: 'Total Qty',
            dataIndex: 'grand_total',
            key: 'grand_total',
            align: 'center',
            render: (row) => {
                return row?.toLocaleString('id-ID')
            }
        },
        {
            title: 'Acq Value (USD)',
            dataIndex: 'acq_value',
            key: 'acq_value',
            align: 'center',
            render: (row) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row)
            },
        },
    ]

    return (
        <Card 
            title="Detail of Pre Fixed Asset Class (USD)"
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

export default AssetClass