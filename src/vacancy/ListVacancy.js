import React, { Component } from 'react';
import { Table, Divider, Icon, Button, Input} from 'antd';
import Highlighter from 'react-highlight-words';
import './ListVacancy.css';
import { getAll } from '../util/VacancyAPI';
import { Link, withRouter } from 'react-router-dom';

class ListVacancy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      vacancy: [],
      isLoading: false
    };
    this.loadVacancyList = this.loadVacancyList.bind(this);
    // this.getColumnSearchProps = this.getColumnSearchProps.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  loadVacancyList() {
    this.setState({
      isLoading: true
    });

    getAll()
      .then(response => {
        this.setState({
          vacancy: response
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        })
      });

  }

  componentDidMount() {
    this.loadVacancyList();
  }

  // componentDidUpdate(nextProps) {
  //   if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
  //     // Reset State
  //     this.state = {
  //       vacancy: [],
  //       isLoading: false
  //     };
  //     this.loadVacancyList();
  //   }
  // }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => { this.searchInput = node; }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })

  handleSearch(selectedKeys, confirm) {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset(clearFilters) {
    clearFilters();
    this.setState({ searchText: '' });
  }

  render() {
    const columns = [{
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ...this.getColumnSearchProps('title'),
    }, {
      title: 'Job Role',
      dataIndex: 'jobRole',
      key: 'jobRole',
      ...this.getColumnSearchProps('jobRole'),
    }, {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: 'Expired Date',
      key: 'expiredDate',
      dataIndex: 'expiredDate',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          {/* eslint-disable-next-line */}
          <a href="javascript:;"><Icon type="zoom-in" /></a>
          <Divider type="vertical" />
          <Link to={"/vacancy/update/"+record.key}><Icon type="edit" /></Link>
          <Divider type="vertical" />
          {/* eslint-disable-next-line */}
          <a href="javascript:;"><Icon type="delete" /></a>
        </span>
      ),
    }];

    const data = [];
    this.state.vacancy.forEach((vacancy, index) => {
      data.push(
        {
          key: vacancy.id,
          title: vacancy.title,
          jobRole: vacancy.jobRole,
          status: vacancy.status,
          expiredDate: vacancy.expiredDate,
        }
      );
    });
    
    return (
      <div className="list-vacancy-container">
        <h1>Vacancy List</h1>
        <Link to="/vacancy/create"><Icon type="plus-circle" /> Create Vacancy</Link>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }} />
      </div>
    );
  }
}

export default withRouter(ListVacancy);