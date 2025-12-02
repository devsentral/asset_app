import React, { useState } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload
import secureLocalStorage from  "react-secure-storage";
const user = secureLocalStorage.getItem('authUser') ? JSON.parse(secureLocalStorage.getItem('authUser')) : null

export const Uploader = (props) => {
    const { title = 'Click to Upload', accept = '.jpg,.jpeg,.png', dragger = false, multiple = false } = props
    const [files, setFiles] = useState([])

    const removeFile = (v) => {
        // props.isRemove(true)

        if (v.status === 'error') {
            props.isRemove(false)
        } else {
            props.isRemove(false)
        }

        props.isRemove(false)
    }

    const handleChange = info => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        props.isUploading(true)

        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            props.isUploading(false)
            props.onUploaded(info.file.response)
            // removeFile()
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            setTimeout(() => {
                message.error(info.file.response.msg)
            }, 1000);
            props.isUploading(false)
        }
        setFiles(fileList)
    }

    const uploadHandler = {
        name: 'attachment',
        multiple: multiple ? true : false,
        action: `${import.meta.env.VITE_API_URL}/upload`,
        headers: {
            'authorization': `Bearer ${user.access_token}`,
            'client-id': `${import.meta.env.VITE_CLIENT_KEY}`,
            'client-secret': `${import.meta.env.VITE_CLIENT_SECRET}`
        },
        data: {
            directory: props.directory
        },
        accept: accept,
        onChange: handleChange,
        onRemove: removeFile
    };

    return (
        <div>
            {
                dragger ?
                    <Dragger {...uploadHandler}>
                        <p className="text-center">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area for upload</p>
                    </Dragger>
                    :
                    <Upload {...uploadHandler} fileList={files}>
                        <Button icon={<UploadOutlined />}>{title}</Button>
                    </Upload>
            }
        </div>
    );
}