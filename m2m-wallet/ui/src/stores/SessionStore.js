import { EventEmitter } from "events";

import Swagger from "swagger-client";
import { checkStatus, errorHandler, errorHandlerLogin } from "./helpers";

class SessionStore extends EventEmitter {
  constructor() {
    super();
    this.client = null;
    this.user = null;
    this.organizations = [];
    this.settings = {};
    this.branding = {};

    this.swagger = Swagger("/swagger/internal.swagger.json", this.getClientOpts())
    
    this.swagger.then(client => {
      this.client = client;

      /* if (this.getToken() !== null) {
        this.fetchProfile(() => {});
      } */
    });
  }

  getClientOpts() {
    return {
      requestInterceptor: (req) => {
        if (this.getToken() !== null) {
          req.headers["Grpc-Metadata-Authorization"] = "Bearer " + this.getToken();
        }
        return req;
      },
    }
  }

  setToken(token) {
    localStorage.setItem("jwt", token);
  }

  getToken() {
    return localStorage.getItem("jwt");
  }

  getOrganizationID() {
    const orgID = localStorage.getItem("organizationID");
    if (orgID === "") {
      return null;
    }

    return orgID;
  }

  setOrganizationID(id) {
    localStorage.setItem("organizationID", id);
    this.emit("organization.change");
  }

  getLoraHostUrl() {
    const loraHostUrl = localStorage.getItem("loraHostUrl");
    if (loraHostUrl === "") {
      return null;
    }

    return loraHostUrl;
  }

  setLoraHostUrl(loraHostUrl) {
    localStorage.setItem("loraHostUrl", loraHostUrl);
  }

  setOrganizationList(organizations) {
    let organizationList = null;
    
    if(organizations.length > 0){
      organizationList = organizations.map((o, i) => { 
      return {label: o.organizationName, value: o.organizationID}});
    }
    
    localStorage.setItem("organizationList", JSON.stringify(organizationList));
    this.emit("organizationList.change");
    //this.emit("organizationList.change");
  }

  getOrganizationList() {
    const organizationList = localStorage.getItem("organizationList");
    if (organizationList.length == 0) {
      return null;
    }

    return JSON.parse(organizationList);
  }

  getUser() {
    return this.user;
  }

  getSettings() {
    return this.settings;
  }

  isAdmin() {
    if (this.user === undefined || this.user === null) {
      return false;
    }
    return this.user.isAdmin;
  }

  isOrganizationAdmin(organizationID) {
    for (let i = 0; i < this.organizations.length; i++) {
      if (this.organizations[i].organizationID === organizationID) {
        return this.organizations[i].isAdmin;
      }
    }
  }

  initProfile(data) {
    const { jwt, org_id, loraHostUrl } = data;
    
    if(jwt === "" || org_id === "" || org_id === undefined){
      window.location.replace(loraHostUrl);
    }
    
    this.setToken(jwt);
    this.setLoraHostUrl(loraHostUrl);
    this.setOrganizationID(org_id);
  }

  login(login, callBackFunc) {
    this.swagger.then(client => {
      client.apis.InternalService.Login({body: login})
        .then(checkStatus)
        .then(resp => {
          if(resp.body.jwt === ""){
            callBackFunc(false);  
          }else{
            callBackFunc(true);
          }
          //this.fetchProfile(callBackFunc);
        })
        .catch(errorHandlerLogin);
    });
  }

  logout(callBackFunc) {
    localStorage.clear();
    this.user = null;
    this.organizations = [];
    this.settings = {};
    this.emit("change");
    callBackFunc();
  }

  fetchProfile(callBackFunc) {
    this.swagger.then(client => {
      client.apis.InternalService.Profile({})
        .then(checkStatus)
        .then(resp => {
          this.user = resp.obj.user;

          if(resp.obj.organizations !== undefined) {
            this.organizations = resp.obj.organizations;
          }

          if(resp.obj.settings !== undefined) {
            this.settings = resp.obj.settings;
          }

          this.emit("change");
          callBackFunc();
        })
        .catch(errorHandler);
    });
  }

  globalSearch(search, limit, offset, callbackFunc) {
    this.swagger.then(client => {
      client.apis.InternalService.GlobalSearch({
        search: search,
        limit: limit,
        offset: offset,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
      });
  }

  getBranding(callbackFunc) {
    return false;
    /* this.swagger.then(client => {
      client.apis.InternalService.Branding({})
        .then(checkStatus)
        .then(resp => {
          callbackFunc(resp.obj);
        })
        .catch(errorHandler);
    }); */
  }
}

const sessionStore = new SessionStore();
export default sessionStore;
