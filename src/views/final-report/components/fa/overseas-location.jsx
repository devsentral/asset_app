import { useEffect, useState } from 'react'
import { Card, Table } from "antd"
import { api } from '@/api'

const OverseasLocation = ({stockTakingId}) => {
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState([]);
    const [assetClassColumns, setAssetClassColumns] = useState([]);

    const fetchData = () => {
        setLoading(true)
        api("GET", `final-report/by-overseas-location/${stockTakingId}`).then((res) => {
            setDatas(res.data)
            setLoading(false)
        })
    }

    const fetchAssetClassColumn = () => {
        setLoading(true)
        api("GET", `final-report/by-asset-class-column/${stockTakingId}?type=OVERSEAS`).then((res) => {
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
            title: 'Incharge Company',
            dataIndex: 'company_name',
            key: 'company_name',
            align: 'center',
        },
        {
            title: 'State',
            dataIndex: 'country_code',
            key: 'country_code',
            align: 'center',
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
            title: 'Acq value (USD)',
            dataIndex: 'acq_value',
            key: 'acq_value',
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
        <Card 
            title="Detail of Fixed Asset in Overseas Location"
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

export default OverseasLocation