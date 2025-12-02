import { 
    Row,
    Col
} from 'antd'
import HeaderLayout from '@/layouts/Header';

// components
import FAbyAssetClass from './components/FAbyAssetClass'
import PFAbyAssetClass from './components/PFAbyAssetClass'
import FAbyStatus from './components/FAbyStatus'
import PFAbyStatus from './components/PFAbyStatus'
import Counting from './components/counting'
import Summary from './components/summary'
import InternalAsset from './components/internalAsset'
import ExternalAsset from './components/externalAsset'

import styled from 'styled-components';

const BgInfo = styled.div`
      background-color: ${({ theme }) => theme.token.colorInfoBg};
`;

const TextInfo = styled.div`
      color: ${({ theme }) => theme.token.textInfo};
`;
const TextPrimary = styled.div`
      color: ${({ theme }) => theme.token.textDark};
`;

const Dashboard = () => {

    return (
        <div>
            <HeaderLayout />

            <Row gutter={[20]} style={{ marginTop: 40, marginBottom: 10, marginLeft: 40, marginRight: 40 }}>
                <Col span={24} xl={24} className="gutter-row" style={{ marginBottom: 20 }}>
                    <BgInfo style={{ padding: '22px', borderRadius: '8px', position:'relative' }}>
                        <Row style={{ display: "flex", justifyContent: "space-between" }} className="gy-5">
                            <Col className="col-sm">
                                <TextPrimary style={{ fontSize: "18px", marginBottom:'8px', fontWeight:'600' }}>StockIt</TextPrimary>
                                <TextInfo className="mb-0">The comparison between physical stock and stock system to find the discrepancy to be adjusted and reported to Management</TextInfo>
                            </Col>
                        </Row>
                    </BgInfo>
                </Col>
            </Row>

            <Summary/>

            <Row gutter={[20]} style={{ marginTop: 20, marginBottom: 10, marginLeft: 40, marginRight: 40 }}>

                <Col span={24} xl={12} style={{ marginBottom: 20 }} className="gutter-row">
                    <FAbyAssetClass/>
                </Col>
                <Col span={24} xl={12} style={{ marginBottom: 20 }} className="gutter-row">
                    <PFAbyAssetClass/>
                </Col>

                <Counting/>

                <Col span={24} xl={12} style={{ marginBottom: 20 }} className="gutter-row">
                    <InternalAsset/>
                </Col>
                <Col span={24} xl={12} style={{ marginBottom: 20 }} className="gutter-row">
                    <ExternalAsset/>
                </Col>

                <Col span={24} xl={12} style={{ marginBottom: 20 }} className="gutter-row">
                    <FAbyStatus/>
                </Col>
                <Col span={24} xl={12} style={{ marginBottom: 20 }} className="gutter-row">
                    <PFAbyStatus/>
                </Col>
            </Row>
        </div>
    )
}

export default Dashboard