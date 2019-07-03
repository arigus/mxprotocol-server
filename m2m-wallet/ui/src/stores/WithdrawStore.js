import { EventEmitter } from "events";

import Swagger from "swagger-client";

import sessionStore from "./SessionStore";
import {checkStatus, errorHandler } from "./helpers";
import dispatcher from "../dispatcher";


class WithdrawStore extends EventEmitter {
  constructor() {
    super();
    this.swagger = new Swagger("/swagger/withdraw.swagger.json", sessionStore.getClientOpts());
  }

  getWithdrawFee(money_abbr, callbackFunc) {
    this.swagger.then(client => {
      client.apis.WithdrawService.GetWithdrawFee({
        money_abbr,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  WithdrawReq(){
    this.swagger.then(client => {
      client.apis.WithdrawService.WithdrawReq({
        //money_abbr
      })
      .then(checkStatus)
      .then(resp => {
        // callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }
  /* "orgId": {
    "type": "string",
    "format": "int64"
  },
  "moneyAbbr": {
    "$ref": "#/definitions/apiMoney"
  },
  "amount": {
    "type": "number",
    "format": "float" */
  notify(action) {
    dispatcher.dispatch({
      type: "CREATE_NOTIFICATION",
      notification: {
        type: "success",
        message: "user has been " + action,
      },
    });
  }
}

const withdrawStore = new WithdrawStore();
export default withdrawStore;