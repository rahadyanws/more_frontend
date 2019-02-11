import React, { Component } from 'react';
import { Form, Input, Button, notification, Select, DatePicker} from 'antd';
import './UpdateVacancy.css';
import { 
  TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, 
  JOBROLE_MIN_LENGTH, JOBROLE_MAX_LENGTH,
} from '../util/constants';
import { update, getById } from '../util/VacancyAPI'
import moment from 'moment';
import { Editor } from '@tinymce/tinymce-react';

const FormItem = Form.Item;
const Option = Select.Option;

class UpdateVacancy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: {
        value: ''
      },
      jobRole: {
        value: ''
      },
      description: {
        value: ''
      },
      status: {
        value: ''
      },
      expiredDate: {
        value: ''
      },
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.disabledDate = this.disabledDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }


  handleSubmit(event) {
    event.preventDefault();
    const updateRequest = {
      id: this.props.match.params.id,
      title: this.state.title.value,
      jobRole: this.state.jobRole.value,
      description: this.state.description.value,
      status: this.state.status.value,
      expiredDate: this.state.expiredDate.value
    };
    update(updateRequest)
      .then(response => {
        notification.success({
          message: 'MORE',
          description: "Thank you! You're successfully create a vacancy.",
        });
        this.props.history.push("/vacancy/list");
      }).catch(error => {
        notification.error({
          message: 'MORE',
          description: error.message || 'Sorry! Something went wrong. Please try again!'
        });
      });
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  handleSelectChange(value, validationFun) {
    const inputName = "status";
    const inputValue = value;
    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  handleDateChange(date, dateString, validationFun) {
    const inputName = "expiredDate";
    const inputValue = dateString;
    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  handleEditorChange(event, validationFun) {
    const inputName = "description";
    const inputValue = event.target.getContent();

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  isFormInvalid() {
    return !(this.state.title.validateStatus === 'success' &&
      this.state.jobRole.validateStatus === 'success' &&
      this.state.description.validateStatus === 'success' &&
      this.state.status.validateStatus === 'success' &&
      this.state.expiredDate.validateStatus === 'success'
    );
  }

  componentDidMount() {
    getById(this.props.match.params.id)
      .then(response => {
        notification.success({
          message: 'MORE',
          description: "Thank you! You're successfully get a vacancy.",
        });
        console.log(response);
        this.setState({
          id: {
            value: response.object.id,
            validateStatus: 'success'
          },
          title: {
            value: response.object.title,
            validateStatus: 'success'
          },
          jobRole: {
            value: response.object.jobRole,
            validateStatus: 'success'
          },
          description: {
            value: response.object.description,
            validateStatus: 'success'
          },
          status: {
            value: response.object.status,
            validateStatus: 'success'
          },
          expiredDate: {
            value: response.object.expiredDate,
            validateStatus: 'success'
          },
        });
        
      }).catch(error => {
        notification.error({
          message: 'MORE',
          description: error.message || 'Sorry! Something went wrong. Please try again!'
        });
      });
  }
  render() {
    return (
      <div className="create-vacancy-container">
        <h1>Update Vacancy</h1>
        <Form onSubmit={this.handleSubmit} className="signup-form">
          <FormItem 
              label="Title"
              hasFeedback
              validateStatus={this.state.title.validateStatus}
              help={this.state.title.errorMsg}>
              <Input 
                  size="large"
                  name="title"
                  autoComplete="off"
                  placeholder="Please input title of vacancy"
                  value={this.state.title.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateTitle)} />    
          </FormItem>
          <FormItem 
              label="Job Role"
              hasFeedback
              validateStatus={this.state.jobRole.validateStatus}
              help={this.state.jobRole.errorMsg}>
              <Input 
                  size="large"
                  name="jobRole" 
                  autoComplete="off"
                  placeholder="Please input job role of vacancy"
                  value={this.state.jobRole.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateJobRole)} />    
          </FormItem>
          <FormItem 
              label="Status"
              hasFeedback
              validateStatus={this.state.status.validateStatus}
              help={this.state.status.errorMsg}>
              <Select 
                defaultValue="" 
                size="large"
                name="status"
                value={this.state.status.value} 
                onChange={(event) => this.handleSelectChange(event, this.validateStatus)} > 
                  <Option value=""> - Choose - </Option>
                  <Option value="pending">Pending</Option>
                  <Option value="publish">Publish</Option>
              </Select>
          </FormItem>
          <FormItem 
              label="Description"
              validateStatus={this.state.description.validateStatus}
              help={this.state.description.errorMsg}>
              <Editor
                  init={{
                      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                  }}
                  name="description"
                  initialValue={this.state.description.value}
                  onChange={(event) => this.handleEditorChange(event, this.validateEditor)}
              />
          </FormItem>
          <FormItem 
              label="Expired Date"
              hasFeedback
              validateStatus={this.state.expiredDate.validateStatus}
              help={this.state.expiredDate.errorMsg}>
              <DatePicker 
                size="large"
                name="expiredDate" 
                format='YYYY-MM-DD'
                disabledDate={this.disabledDate}
                // defaultValue={moment(this.state.expiredDate.value, 'YYYY-MM-DD')}
                onChange={(date, dateString) => this.handleDateChange(date, dateString, this.validateDate)} 
                /> 
          </FormItem>
          <FormItem>
              <Button type="primary" 
                  htmlType="submit" 
                  size="large" 
                  className="create-form-button"
                  disabled={this.isFormInvalid()}>Save</Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  validateTitle = (title) => {
    if (title.length < TITLE_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Title is too short (Minimum ${TITLE_MIN_LENGTH} characters needed.)`
      }
    } else if (title.length > TITLE_MAX_LENGTH) {
      return {
        validationStatus: 'error',
        errorMsg: `Title is too long (Maximum ${TITLE_MAX_LENGTH} characters allowed.)`
      }
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  }

  validateJobRole = (jobRole) => {
    if (jobRole.length < JOBROLE_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Job role is too short (Minimum ${JOBROLE_MIN_LENGTH} characters needed.)`
      }
    } else if (jobRole.length > JOBROLE_MAX_LENGTH) {
      return {
        validationStatus: 'error',
        errorMsg: `Job role is too long (Maximum ${JOBROLE_MAX_LENGTH} characters allowed.)`
      }
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  }

  validateStatus = (status) => {
    if (status === '') {
      return {
        validateStatus: 'error',
        errorMsg: `The status should be Pending or Publish`
      }
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  }

  validateDate = (expiredDate) => {
    if (expiredDate === '') {
      return {
        validateStatus: 'error',
        errorMsg: `Please input vacancy expired date.`
      }
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  }

  validateEditor = (desc) => {
    if (desc === '') {
      return {
        validateStatus: 'error',
        errorMsg: `Please input vacancy description.`
      }
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  }

}

export default UpdateVacancy;