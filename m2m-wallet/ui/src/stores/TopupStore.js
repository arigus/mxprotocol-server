import { EventEmitter } from "events";

import Swagger from "swagger-client";

import sessionStore from "./SessionStore";
import {checkStatus, errorHandler } from "./helpers";
import updateOrganizations from "./SetUserProfile";
import dispatcher from "../dispatcher";


class TopupStore extends EventEmitter {
  constructor() {
    super();
    this.swagger = new Swagger("/swagger/topup.swagger.json", sessionStore.getClientOpts());
  }

  getTopUpHistory(orgId, offset, limit, callbackFunc) {
    this.swagger.then(client => {
      client.apis.TopUpService.GetTopUpHistory({
        orgId,
        offset,
        limit
      })
      .then(checkStatus)
      .then(updateOrganizations)
      .then(resp => {
        callbackFunc(resp.body);
      })
      .catch(errorHandler);
    });
  }

  WithdrawReq(apiWithdrawReqRequest, callbackFunc) {
    this.swagger.then(client => {
      client.apis.WithdrawService.WithdrawReq({
        "money_abbr": apiWithdrawReqRequest.moneyAbbr,
        body: {
          apiWithdrawReqRequest,
        },
      })
      .then(checkStatus)
      .then(updateOrganizations)
      .then(resp => {
        this.notify("completed");
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }
  
  notify(action) {
    dispatcher.dispatch({
      type: "CREATE_NOTIFICATION",
      notification: {
        type: "success",
        message: "Transaction has been " + action,
      },
    });
  }
}

const topupStore = new TopupStore();
export default topupStore;
