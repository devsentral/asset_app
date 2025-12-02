import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Row, Col, Button } from 'antd'
import Breadcrumb from "@/common/Breadcrumb";
import { FilePdfOutlined } from '@ant-design/icons';
import { api } from '@/api'
import HeaderLayout from '@/layouts/Header';

import FASummary from './components/fa/summary';
import FASummaryOverseas from './components/fa/summary-overseas';
import FAInternal from './components/fa/internal';
import FAExternal from './components/fa/external';
import FAOverseasLocation from './components/fa/overseas-location';
import FAAssetClass from './components/fa/asset-class';

import PFASummary1 from './components/pfa/summary1';
import PFASummary2 from './components/pfa/summary2';
import PFAInternal from './components/pfa/internal';
import PFAExternal from './components/pfa/external';
import PFAAssetClass from './components/pfa/asset-class';
import { roleAccess } from '@/helpers/menu'

const FinalReport = () => {
    const { stockTakingId } = useParams()
    const [downloading, setDownloading] = useState(false);
    const [stockTaking, setStockTaking] = useState([])
    
    const fetchStockTaking = () => {
        api("GET", `stock-taking/${stockTakingId}`)
        .then((res) => {
            setStockTaking(res.data)
        })
    }

    useEffect(() => {
        fetchStockTaking()
    }, [stockTakingId]);

    const downloadPdfReport = () => {
        setDownloading(true)
        api("GET", `final-report/download-pdf/${stockTakingId}`).then((res) => {
            window.open(res.data?.path)
            setDownloading(false)
        })
    }
    
    return (
        <div>
            <HeaderLayout stockTake={stockTaking}/>

            {/* Breadcrumb */}
            <Breadcrumb mainTitle={`Final Report - ${stockTaking?.name}`}/>

            <Row>
                <Col xs={24} className="gutter-row">
                    <Card className="content-container">
                        <div className="full-width mb-3">
                            <Row justify="space-between">
                                <Col>
                                </Col>
                                <Col>
                                    {roleAccess('final report download') ?
                                        <Button size="middle" onClick={downloadPdfReport} 
                                            loading={downloading}
                                            style={{ background: '#f5222d', color: 'white' }}>
                                            <FilePdfOutlined /> Download PDF Report
                                        </Button>
                                    : null}
                                </Col>
                            </Row>
                        </div>
                        {/* FA */}
                        { stockTaking?.category_id == 1 ? 
                            <>
                                <FASummary stockTakingId={stockTakingId}/>
                                <FASummaryOverseas stockTakingId={stockTakingId}/>
                                <FAInternal stockTakingId={stockTakingId}/>
                                <FAExternal stockTakingId={stockTakingId}/>
                                <FAOverseasLocation stockTakingId={stockTakingId}/>
                                <FAAssetClass stockTakingId={stockTakingId}/>
                            </>
                        : null }

                        {/* PFA */}
                        { stockTaking?.category_id == 2 ? 
                            <>
                                <PFASummary1 stockTakingId={stockTakingId}/>
                                <PFASummary2 stockTakingId={stockTakingId}/>
                                <PFAInternal stockTakingId={stockTakingId}/>
                                <PFAExternal stockTakingId={stockTakingId}/>
                                <PFAAssetClass stockTakingId={stockTakingId}/>
                            </>
                        : null }
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default FinalReport