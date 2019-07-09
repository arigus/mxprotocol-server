import React, { Component } from "react";
<<<<<<< HEAD
import { withRouter } from 'react-router-dom';
=======
import { withRouter, Link } from 'react-router-dom';
>>>>>>> nam/fr-b-logic
import { withStyles } from "@material-ui/core/styles";

import Grid from '@material-ui/core/Grid';
import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";
import Divider from '@material-ui/core/Divider';
import MoneyStore from "../../stores/MoneyStore";
import SessionStore from "../../stores/SessionStore";
import ModifyEthAccountForm from "./ModifyEthAccountForm";
import theme from "../../theme";

const styles = {
  tabs: {
    borderBottom: "1px solid " + theme.palette.divider,
    height: "49px",
  },
  navText: {
    fontSize: 14,
  },
  TitleBar: {
    height: 115,
    width: '50%',
    light: true,
    display: 'flex',
    flexDirection: 'column'
  },
  card: {
    minWidth: 180,
    width: 220,
    backgroundColor: "#0C0270",
  },
  divider: {
    padding: 0,
    color: '#FFFFFF',
    width: '100%',
  },
  padding: {
    padding: 0,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
<<<<<<< HEAD
=======
  },
  link: {
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: 12,
    color: theme.palette.textSecondary.main,
    opacity: 0.7,
      "&:hover": {
        opacity: 1,
      }
>>>>>>> nam/fr-b-logic
  },
};

const coinType = "Ether";

class ModifyEthAccount extends Component {
  constructor() {
      super();
      this.state = {};
      this.loadData = this.loadData.bind(this);
    }
    
    componentDidMount() {
      this.loadData();
    }
    
    loadData() {
      MoneyStore.getActiveMoneyAccount(coinType, this.props.match.params.organizationID, resp => {
        this.setState({
          activeAccount: "dummyAcount"//resp.activeAccount,
        });
      }); 
    }

    onSubmit = (resp) => {
      resp.orgId = this.props.match.params.organizationID;
      resp.money_abbr = coinType;
      
      const login = {};
      login.username = resp.username;
      login.password = resp.password;

      SessionStore.login(login, (response) => {
        if(response === "ok"){
          MoneyStore.modifyMoneyAccount(resp, resp => {
            
          })
        }else{
          alert("inccorect username or password.");
        }
      })
    } 

  render() {
    return(
      <Grid container spacing={24}>
        <Grid item xs={12} className={this.props.classes.divider}>
          <div className={this.props.classes.TitleBar}>
<<<<<<< HEAD
              <TitleBar className={this.props.classes.padding}>
                <TitleBarTitle title="ETH Account" />
              </TitleBar>
{/*               <Divider light={true}/>
              <TitleBar>
                <TitleBarTitle title="M2M Wallet" className={this.props.classes.navText}/>
                <TitleBarTitle title="/" className={this.props.classes.navText}/>
                <TitleBarTitle title="ETH Account" className={this.props.classes.navText}/>
              </TitleBar> */}
          </div>
=======
                <TitleBar className={this.props.classes.padding}>
                  <TitleBarTitle title="Eth Account" />
                </TitleBar>
                <Divider light={true}/>
                <div className={this.props.classes.breadcrumb}>
                <TitleBar>
                  <TitleBarTitle component={Link} to="#" title="M2M Wallet" className={this.props.classes.link}/> 
                  <TitleBarTitle title="/" className={this.props.classes.navText}/>
                  <TitleBarTitle component={Link} to="#" title="Eth Account" className={this.props.classes.link}/>
                </TitleBar>
                </div>
            </div>
>>>>>>> nam/fr-b-logic
        </Grid>
        <Grid item xs={6} className={this.props.classes.column}>
          <ModifyEthAccountForm
            submitLabel="Confirm"
            onSubmit={this.onSubmit}
            activeAccount={this.state.activeAccount}
          />
        </Grid>
        <Grid item xs={6}>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withRouter(ModifyEthAccount));