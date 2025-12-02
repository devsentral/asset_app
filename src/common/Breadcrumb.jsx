import { Col, Row, theme } from 'antd';
import React from 'react'

const Breadcrumb = ({mainTitle, pageTitle}) => {
    const { token } = theme.useToken();

    return (
        <React.Fragment>
            <Row align="middle" style={{ marginTop: 15, marginBottom: 15, color: token.colorText }}>
                <Col xs={24} md={24} align="middle">
                    {mainTitle ?
                        <h5 className='ant-font-size-16 ant-mb-0' style={{fontSize:'24px', fontWeight:'500'}}>{mainTitle}</h5>
                    : null } 
                    {pageTitle ? 
                        <h5 className='ant-font-size-16 ant-mb-0' style={{fontSize:'24px', fontWeight:'500', marginTop: 10 }}>{pageTitle}</h5>
                    : null }
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default Breadcrumb;
