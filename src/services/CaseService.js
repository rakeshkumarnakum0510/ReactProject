import http from "../http-common";

class CaseService {
  getAll() {
    return http.get("/cases");
  }

  get(id) {
    return http.get(`/cases/${id}`);
  }

  create(data) {
    console.log(data)
    return http.post("/cases", data);
  }

  update(id, data) {
    console.log(data)
    return http.put(`/cases/${id}`, data);
  }

  delete(id) {
    return http.delete(`/cases/${id}`);
  }

  deleteAll() {
    return http.delete(`/cases`);
  }

  findByTitle(title) {
    return http.get(`/cases?title=${title}`);
  }
}

export default new CaseService();