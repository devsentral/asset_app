import React from 'react';
import { Popconfirm, Button } from 'antd'
import { Link } from 'react-router-dom'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, ZoomInOutlined, SaveOutlined, CheckCircleOutlined, CheckOutlined, ArrowLeftOutlined, EyeOutlined, FilePdfOutlined, UploadOutlined, FileOutlined, FileAddOutlined, FolderAddOutlined, DownloadOutlined, ExportOutlined } from '@ant-design/icons'

export const DeleteButton = (props) => {
    const { title = 'Delete', size = "middle", confirm_title = "Delete this data ?", loading = false } = props
    return (
        <Popconfirm title={confirm_title} okText="Yes" cancelText="No" onConfirm={() => props.onConfirm()}>
            <Button loading={loading} className='button-danger' size={size} type="primary">
                {title}
            </Button>
        </Popconfirm>
    );
}

export const ShowButton = (props) => {
    const { link = false, to = "/", size = "small", loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} type="link" icon={<ZoomInOutlined />} />
            </Link>
        )
    }
    return (
        <Button loading={loading} type="link" size={size} shape="circle" onClick={() => props.onShow()} icon={<ZoomInOutlined />} />
    );
}

export const BackButton = (props) => {
    const { to = null, title = 'Back', right = false, loading = false } = props
    return (
        <Link to={to} style={(right) ? { float: 'right' } : null}>
            <Button loading={loading} type="danger" icon={<ArrowLeftOutlined />}> {title}</Button>
        </Link>
    );
}

export const AddButton = (props) => {
    const { title = 'Add Data', right = false, size = "middle", loading = false, disabled } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-primary' size={size} type="primary" onClick={() => props.onAdd()} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const ViewButton = (props) => {
    const { title = 'View', right = false, size = "middle", loading = false, disabled } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-primary' size={size} type="primary" onClick={() => props.onShow()} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const EditButton = (props) => {
    const { title = 'Edit', right = false, size = "middle", loading = false, disabled } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-edit' size={size} type="primary" onClick={() => props.onEdit()} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const DoneButton = (props) => {
    const { title = 'Add Data', right = false, size = "middle", disabled, loading = false, shape } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-primary' shape={shape} size={size} type="primary" onClick={() => props.onDone()} icon={<CheckOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const SaveButton = (props) => {
    const { title = 'Save Data', right = false, size = "middle", disabled, loading = false } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-primary' size={size} type="primary" onClick={() => props.onSave()} icon={<SaveOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const ReuploadButton = (props) => {
    const { title = 'Reupload File', right = false, size = "middle", disabled, loading = false } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-primary' size={size} type="primary" onClick={() => props.onReupload()} icon={<UploadOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const PrimaryEditButton = (props) => {
    const { title = 'Edit Excel', right = false, size = "middle", disabled, loading = false } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-primary' size={size} type="primary" onClick={() => props.onEdit()} icon={<EditOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const SelectButton = (props) => {
    const { title = 'Select Item', right = false, size = "middle", disabled, loading = false } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-primary' shape='round' size={size} type="primary" onClick={() => props.onSelect()} icon={<CheckCircleOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const DetailButton = (props) => {
    const { to = null, title = 'View Detail', right = false, loading = false } = props
    return (
        <Link to={to} style={(right) ? { float: 'right' } : null}>
            <Button loading={loading} type="primary" icon={<EyeOutlined />}> {title}</Button>
        </Link>
    );
}

export const SubmitButton = (props) => {
    const { title = 'save', size = "middle", right = false, loading = false, disabled } = props
    return (
        <Button loading={loading} disabled={disabled} className='button-primary' size={size} type="primary" onClick={() => props.onSubmit()} icon={<CheckOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    )
}

export const PrintPdfButton = (props) => {
    const { title = 'Print', right = false, size = "middle", loading = false } = props
    return (
        <Button loading={loading} size={size} type="primary" onClick={() => props.onPrint()} icon={<FilePdfOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const ExportDataButton = (props) => {
    const { title = 'Export', right = false, size = "middle", shape = "", loading = false } = props
    return (
        <Button loading={loading} className='button-primary ' size={size} shape={shape} type="primary" onClick={() => props.onExport()} icon={<FileOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const UploadDataButton = (props) => {
    const { title = 'Upload', right = false, size = "middle", shape = "", loading = false } = props
    return (
        <Button loading={loading} className='button-primary ' size={size} shape={shape} type="primary" onClick={() => props.onUpload()} icon={<UploadOutlined />} style={(right) ? { float: 'right' } : null}>
            {title}
        </Button>
    );
}

export const CustomButton = (props) => {
    const { link = false, to = "/", size = "small", icon = <EditOutlined />, loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} type="link" icon={icon} />
            </Link>
        )
    }
    return (
        <Button loading={loading} type="link" size={size} shape="circle" onClick={() => props.onEdit()} icon={icon} />
    );
}

export const AddFileButton = (props) => {
    const { link = false, to = "/", size = "small", loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} type="link" icon={<FileAddOutlined />} />
            </Link>
        )
    }
    return (
        <Button loading={loading} type="link" size={size} shape="circle" onClick={() => props.onAddFile()} icon={<FileAddOutlined />} />
    );
}

export const AddFolderButton = (props) => {
    const { link = false, to = "/", size = "small", disabled, loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} icon={<FolderAddOutlined />} >Add Folder</Button>
            </Link>
        )
    }
    return (
        <Button loading={loading} disabled={disabled} size={size} onClick={() => props.onAddFolder()} icon={<FolderAddOutlined />} >Add Folder</Button>
    );
}

export const EditNameButton = (props) => {
    const { link = false, to = "/", size = "small", loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} type="link" icon={<EditOutlined />} />
            </Link>
        )
    }
    return (
        <Button loading={loading} type="link" size={size} shape="circle" onClick={() => props.onEditName()} icon={<EditOutlined />} />
    );
}

export const DeleteFileButton = (props) => {
    const { link = false, to = "/", size = "small", disabled, loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} icon={<DeleteOutlined />} >Delete</Button>
            </Link>
        )
    }
    return (
        <Button loading={loading} disabled={disabled} size={size} onClick={() => props.onDeleteFile()} icon={<DeleteOutlined />} >Delete</Button>
    );
}

export const UploadIconButton = (props) => {
    const { link = false, to = "/", size = "small", disabled, loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} icon={<UploadOutlined />} > Upload</Button>
            </Link>
        )
    }
    return (
        <Button loading={loading} disabled={disabled} size={size} onClick={() => props.onUpload()} icon={<UploadOutlined />} >Upload</Button>
    );
}

export const UpdateUploadIconButton = (props) => {
    const { link = false, to = "/", size = "small", loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} icon={<UploadOutlined />} >Reupload</Button>
            </Link >
        )
    }
    return (
        <Button loading={loading} size={size} onClick={() => props.onUpload()} icon={<UploadOutlined />} >Reupload</Button>
    );
}

export const DownloadIconButton = (props) => {
    const { link = false, to = "/", size = "small", loading = false } = props
    if (link) {
        return (
            <Link to={to}>
                <Button loading={loading} icon={<DownloadOutlined />} >Download</Button>
            </Link >
        )
    }
    return (
        <Button loading={loading} size={size} onClick={() => props.onDownload()} icon={<DownloadOutlined />} >Download</Button>
    );
}