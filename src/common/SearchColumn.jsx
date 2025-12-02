import React, { useRef, useState } from 'react';
import { SearchOutlined, FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { Col, Checkbox } from 'antd'
import dayjs from 'dayjs'

const SearchColumn = (dataIndex, handleSearch) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    
    const onSearch = (selectedKeys) => {
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);

        // confirm();
        handleSearch({
            [dataIndex]: selectedKeys[0]
        });
    };

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
            <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => onSearch(selectedKeys)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => onSearch(selectedKeys)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ fontSize: 16, color: filtered ? '#fff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => {
                        var _a;
                        return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
                    }, 100);
                }
            },
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    };
};

const FilterColumn = (dataIndex, handleSearch, options) => {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const searchInput = useRef(null);
    
    const onSearch = () => {
        handleSearch({
            [dataIndex]: selectedKeys
        });
    };
  
    // Handle checkbox change
    const handleCheckboxChange = (checkedValues) => {
        setSelectedKeys(checkedValues.length ? checkedValues : []);
    };

    return {
        filterDropdown: () => (
            <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                <Checkbox.Group 
                    value={selectedKeys} 
                    onChange={handleCheckboxChange}
                    style={{ marginBottom: 10, display: 'block' }}
                    >
                    {options.map(option => (
                        <Col key={option.value} span={24} style={{ paddingLeft: 0 }}>
                            <Checkbox key={option.value} value={option.value}>
                                {option.text}
                            </Checkbox>
                        </Col>
                    ))}
                </Checkbox.Group>
                <Button 
                    type="primary" 
                    onClick={onSearch} 
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Apply
                </Button>
            </div>
        ),
        filterIcon: filtered => <FilterOutlined style={{ fontSize: 16, color: filtered ? '#fff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => {
                        var _a;
                        return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
                    }, 100);
                }
            },
        },
    };
};

const FilterDateColumn = (dataIndex, handleSearch) => {
    const [date, setDate] = useState('');
    const searchInput = useRef(null);
    
    const onSearch = () => {
        handleSearch({
            [dataIndex]: date ? dayjs(date).format('YYYY-MM-DD') : null
        });
    };

    return {
        filterDropdown: ({ selectedKeys }) => (
            <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                <DatePicker
                    ref={searchInput}
                    placeholder={`Search Date`}
                    onChange={(e) => setDate(e)}
                    onPressEnter={onSearch}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={onSearch}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Apply
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <CalendarOutlined style={{ fontSize: 16, color: filtered ? '#fff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => {
                        var _a;
                        return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
                    }, 100);
                }
            },
        },
    };
};

const FilterYearColumn = (dataIndex, handleSearch) => {
    const [year, setYear] = useState('');
    const searchInput = useRef(null);
    
    const onSearch = () => {
        handleSearch({
            [dataIndex]: year ? dayjs(year).format('YYYY') : null
        });
    };

    return {
        filterDropdown: ({ selectedKeys }) => (
            <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                <DatePicker
                    ref={searchInput}
                    picker="year"
                    placeholder={`Search Year`}
                    onChange={(e) => setYear(e)}
                    onPressEnter={onSearch}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={onSearch}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Apply
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <CalendarOutlined style={{ fontSize: 16, color: filtered ? '#fff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => {
                        var _a;
                        return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
                    }, 100);
                }
            },
        },
    };
};

export { SearchColumn, FilterColumn, FilterDateColumn, FilterYearColumn };