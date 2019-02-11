import {
  API_BASE_URL,
  ACCESS_TOKEN
} from './constants';

const request = (options) => {
  const headers = new Headers({
      'Content-Type': 'application/json',
  })

  if (localStorage.getItem(ACCESS_TOKEN)) {
      headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
  }

  const defaults = {
      headers: headers
  };
  options = Object.assign({}, defaults, options);
  return fetch(options.url, options)
      .then(response =>
          response.json().then(json => {
              if (!response.ok) {
                  return Promise.reject(json);
              }
              return json;
          })
      );
};

export function getAll() {
  return request({
      url: API_BASE_URL + "/vacancy",
      method: 'GET'
  });
}

export function getById(id) {
  return request({
    url: API_BASE_URL + "/vacancy/" + id,
    method: 'GET'
  });
}

export function update(vacancyData) {
  return request({
      url: API_BASE_URL + "/vacancy",
      method: 'PUT',
      body: JSON.stringify(vacancyData)         
  });
}

export function create(vacancyData) {
  return request({
      url: API_BASE_URL + "/vacancy",
      method: 'POST',
      body: JSON.stringify(vacancyData)         
  });
}