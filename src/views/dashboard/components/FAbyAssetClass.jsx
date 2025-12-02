import React, { useEffect, useState } from 'react'
import { 
    Card
} from 'antd'
import { Pie } from '@ant-design/plots'
import { api } from '@/api'

const FAbyAssetClass = () => {
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState([])
    const [summary, setSummary] = useState({})

    const fetchData = () => {
        setLoading(true)
        api("GET", `dashboard/stock-taking-summary?category=FA_FIXED_ASSET_CLASS`).then((res) => {
            var data = []
            res?.data?.results?.map((e) => {
                if(e.name != 'Grand Total') {
                    data.push({
                        type: e.name,
                        value: e.total,
                    })
                }
            })
            setDatas(data)
            setSummary(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    const pieData = {
        appendPadding: 10,
        data: datas,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    return (
        <Card
            title={`Fixed Asset - by Asset Class (${summary?.stock_taking?.name ?? ''})`}
        >
            { !loading ?
                <Pie {...pieData} />
            : null }
        </Card>
    )
}

export default FAbyAssetClass