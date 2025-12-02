import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Row, Col, Tabs } from 'antd'
import { api } from '@/api'
import Asset from './components/asset';
import Summary from './components/summary'
import Remark from './components/remark';
import Approval from './components/approval'
import Breadcrumb from "@/common/Breadcrumb";
import HeaderLayout from '@/layouts/Header';

const { TabPane } = Tabs

const StockTakingAudit = () => {
    const { stockTakingLocationId } = useParams()
    const [tabsKey, setTabsKey] = useState('asset')
    const [stockTakingLocation, setStockTakingLocation] = useState([])

    const fetchStockTakingLocation = () => {
        api("GET", `stock-taking-location/${stockTakingLocationId}`).then((res) => {
            setStockTakingLocation(res.data)
        })
    }

    useEffect(() => {
        fetchStockTakingLocation()
    }, [stockTakingLocationId]);

    return (
        <>
            <HeaderLayout stockTake={stockTakingLocation?.stock_taking}/>

            {/* Breadcrumb */}
            <Breadcrumb mainTitle="Audit" pageTitle={stockTakingLocation?.location_name} />
  
            <Row gutter={[24]}>
                <Col xs={24} className="gutter-row">
                    <Card className="content-container">
                        <Card>
                            <Tabs defaultActiveKey={tabsKey} onChange={(v) => setTabsKey(v)} type='card'>
                                <TabPane tab='Assets Check List' key='asset'>
                                    <Asset location={stockTakingLocation}/>
                                </TabPane>
                                <TabPane tab='Summary Stock Taking' key='summary'>
                                    <Summary data={stockTakingLocation}/>
                                </TabPane>
                                <TabPane tab='Remark' key='remark'>
                                    <Remark data={stockTakingLocation}/>
                                </TabPane>

                                {stockTakingLocation.status_audit != 'ACTIVE' ? 
                                    <TabPane tab='Approvals' key='approval'>
                                        <Approval data={stockTakingLocation}/>
                                    </TabPane>
                                : null }
                            </Tabs>
                        </Card>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default StockTakingAudit