import React, { useEffect, useState } from 'react'

import { 
    Card,
    Col,
    Row,
} from 'antd'

import { api } from '@/api'

import usecustomStyles from '@/common/customStyles'
import CountUp from 'react-countup'

import { Briefcase } from 'lucide-react'
const customStyles = usecustomStyles();

import styled from 'styled-components';
const BgInfo = styled.div`
    background-color: ${({ theme }) => theme.token.colorInfoBg};
`;

const TextPrimary = styled.div`
    color: ${({ theme }) => theme.token.textDark};
`;

const TextInfo = styled.div`
    color: ${({ theme }) => theme.token.textInfo};
`;

const Counting = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({})

    const fetchData = () => {
        setLoading(true)
        api("GET", `dashboard/all-asset`).then((res) => {
            setData(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <>
            <Col span={24} xl={24} className="gutter-row" style={{ marginBottom: 20 }}>
                <BgInfo style={{ padding: '22px', borderRadius: '8px', position:'relative' }}>
                    <Row style={{ display: "flex", justifyContent: "space-between" }} className="gy-5">
                        <Col className="col-sm">
                            <TextPrimary style={{ fontSize: "18px", marginBottom:'8px', fontWeight:'600' }}>All Assets</TextPrimary>
                            <TextInfo className="mb-0">Represents the current condition and utilization level of an asset within the organization. This classification helps track operational readiness, optimize resource allocation, and schedule maintenance or replacements effectively.</TextInfo>
                        </Col>
                    </Row>
                </BgInfo>
            </Col>

            <Col span={24} xl={6} style={{ marginBottom: 20 }} className="gutter-row">
                <Card style={{ backgroundColor: customStyles.colorInfo }} hoverable>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ textTransform: "uppercase", fontSize: "13px", color: customStyles.colorInfoBg, marginBottom:'0' }}>Used</p>
                        </div>
                    </div>
                    <div style={{display: "flex", alignItems: "end", justifyContent: "space-between", marginTop: customStyles.marginXS}}>
                        <div>
                            <h4 style={{color: customStyles.colorBgContainer, fontSize: "22px"}}><span data-target="36894">
                                <CountUp start={0} end={data?.used ?? 0} duration={2} separator=',' />
                            </span></h4>
                        </div>
                        <BgInfo style={{ padding: '6px', width: '48px', height: '48px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase style={{ color: customStyles.colorInfo, }} />
                        </BgInfo>
                    </div>
                </Card>
            </Col>

            <Col span={24} xl={6} style={{ marginBottom: 20 }} className="gutter-row">
                <Card style={{ backgroundColor: customStyles.colorDanger }} hoverable>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ textTransform: "uppercase", fontSize: "13px", color: customStyles.colorInfoBg, marginBottom:'0' }}>Idle</p>
                        </div>
                    </div>
                    <div style={{display: "flex", alignItems: "end", justifyContent: "space-between", marginTop: customStyles.marginXS}}>
                        <div>
                            <h4 style={{color: customStyles.colorBgContainer, fontSize: "22px"}}><span data-target="36894">
                                <CountUp start={0} end={data?.idle ?? 0} duration={2} separator=',' />
                            </span></h4>
                        </div>
                        <BgInfo style={{ padding: '6px', width: '48px', height: '48px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase style={{ color: customStyles.colorDanger, }} />
                        </BgInfo>
                    </div>
                </Card>
            </Col>

            <Col span={24} xl={6} style={{ marginBottom: 20 }} className="gutter-row">
                <Card style={{ backgroundColor: customStyles.colorPrimary }} hoverable>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ textTransform: "uppercase", fontSize: "13px", color: customStyles.colorInfoBg, marginBottom:'0' }}>Good</p>
                        </div>
                    </div>
                    <div style={{display: "flex", alignItems: "end", justifyContent: "space-between", marginTop: customStyles.marginXS}}>
                        <div>
                            <h4 style={{color: customStyles.colorBgContainer, fontSize: "22px"}}><span data-target="36894">
                                <CountUp start={0} end={data?.good ?? 0} duration={2} separator=',' />
                            </span></h4>
                        </div>
                        <BgInfo style={{ padding: '6px', width: '48px', height: '48px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase style={{ color: customStyles.colorPrimary, }} />
                        </BgInfo>
                    </div>
                </Card>
            </Col>

            <Col span={24} xl={6} style={{ marginBottom: 20 }} className="gutter-row">
                <Card style={{ backgroundColor: customStyles.colorWarning }} hoverable>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ textTransform: "uppercase", fontSize: "13px", color: customStyles.colorInfoBg, marginBottom:'0' }}>Broken</p>
                        </div>
                    </div>
                    <div style={{display: "flex", alignItems: "end", justifyContent: "space-between", marginTop: customStyles.marginXS}}>
                        <div>
                            <h4 style={{color: customStyles.colorBgContainer, fontSize: "22px"}}><span data-target="36894">
                                <CountUp start={0} end={data?.broken ?? 0} duration={2} separator=',' />
                            </span></h4>
                        </div>
                        <BgInfo style={{ padding: '6px', width: '48px', height: '48px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase style={{ color: customStyles.colorWarning, }} />
                        </BgInfo>
                    </div>
                </Card>
            </Col>
        </>
    )
}

export default Counting