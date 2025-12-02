import React from 'react';
import { Modal, Button, Form, Row, Col, Typography } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Text, Title } = Typography

export const BasicModal = (props) => {
    const { width = 500, title = "Modal Detail" } = props
    return (
        <Modal
            centered
            title={title}
            width={width}
            visible={props.showModal}
            onCancel={() => props.onCloseModal()}
            footer={[
                <Button key="back" onClick={() => props.onCloseModal()}>
                    Close
                </Button>,
            ]}>
            {props.children}
        </Modal>
    );
}

export const FormModal = (props) => {
    const { width = 500, title = "Modal Detail", defaultValues = {}, form = null, loading = false } = props
    return (
        <Modal
            centered
            title={title}
            width={width}
            visible={props.showModal}
            onCancel={() => props.onCloseModal()}
            footer={null}>
            <Form
                layout="vertical"
                form={form}
                initialValues={defaultValues}
                onFinish={props.submitForm}>
                {props.children}
                <div className="full-width text-right">
                    <Button className="button-primary" type="primary" htmlType="submit" loading={loading || props.saving}>{(loading || props.saving) ? 'Saving' : 'Save'}</Button>
                </div>
            </Form>
        </Modal>
    );
}


export const CompanyRegulationModal = (props) => {
    const { width, title = "" } = props
    return (
        <Modal
            style={{ top: 20 }}
            title={title}
            width={width}
            visible={props.showModal}
            onCancel={() => props.onCloseModal()}
            footer={null}>
            {props.children}
            <div className="full-width text-right">
                <Button type="primary" style={{ marginRight: '20px' }} icon={<ArrowLeftOutlined />} onClick={() => props.prevCurrent()}>Prev</Button>
                <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => props.nextCurrent()}>Next</Button>
            </div>
        </Modal>
    );
}

export const RedirectModal = (props) => {
    const { width = "80%", ref } = props
    return (
        <Modal
            centered
            style={{ bottom: 0 }}
            width={width}
            visible={props.showModal}
            footer={null}
            onCancel={() => props.onCloseModal()}>
            <div className='mt-3'>
                <Title style={{ fontSize: 16 }}>
                    Karajo is better on the app
                </Title>
                <Text>
                    Open this in the Karajo app to get the full experience
                </Text>
                <Row className='mt-3' justify='space-between'>
                    <Col>
                        <Button ref={ref} type='primary'>
                            <a href={props.href}>Switch to App</a>
                        </Button>
                    </Col>
                    <Col>
                        <Button type="danger" onClick={() => props.onCloseModal()}>
                            Not now
                        </Button>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}
