import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import blue from "@material-ui/core/colors/blue";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import MenuIcon from "mdi-material-ui/Menu";
import Backburger from "mdi-material-ui/Backburger";
import AccountCircle from "mdi-material-ui/AccountCircle";
import HelpCicle from "mdi-material-ui/HelpCircle";
import Typography from '@material-ui/core/Typography';

import SessionStore from "../stores/SessionStore";
import theme from "../theme";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Wallet from "mdi-material-ui/WalletOutline";

const styles = {
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#09006E',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 10,
  },
  hidden: {
    display: "none",
  },
  flex: {
    flex: 1,
    paddingLeft: 40,
  },
  logo: {
    height: 32,
  },
  search: {
    marginRight: 3 * theme.spacing.unit,
    color: theme.palette.common.white,
    background: blue[400],
    width: 450,
    padding: 5,
    borderRadius: 3,
  },
  avatar: {
    background: blue[600],
    color: theme.palette.common.white,
  },
  chip: {
    background: blue[600],
    color: theme.palette.common.white,
    marginRight: theme.spacing.unit,
    "&:hover": {
      background: blue[400],
    },
    "&:active": {
      background: blue[400],
    },
  },
  iconButton: {
    color: theme.palette.common.white,
    marginRight: theme.spacing.unit,
  },
  iconStyle: {
    color: theme.palette.primary.main,
  },
  noPadding: {
    padding: 0
  }
};


class TopNav extends Component {
  constructor() {
    super();

    this.state = {
      menuAnchor: null,
      balance: "",
      search: "",
    };

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.onMenuOpen = this.onMenuOpen.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  componentDidMount() {
    
  }
  
  onMenuOpen(e) {
    this.setState({
      menuAnchor: e.currentTarget,
    });
  }

  onMenuClose() {
    this.setState({
      menuAnchor: null,
    });
  }

  onLogout() {
    SessionStore.logout(() => {
      this.props.history.push("/login");
    });
  }

  handleDrawerToggle() {
    this.props.setDrawerOpen(!this.props.drawerOpen);
  }

  onSearchChange(e) {
    this.setState({
      search: e.target.value,
    });
  }

  onSearchSubmit(e) {
    e.preventDefault();
    this.props.history.push(`/search?search=${encodeURIComponent(this.state.search)}`);
  }

  render() {
    let drawerIcon;
    if (!this.props.drawerOpen) {
      drawerIcon = <MenuIcon />;
    } else {
      drawerIcon = <Backburger />;
    }

    const open = Boolean(this.state.menuAnchor);
    const balance = "1232345.234"+"MXC";
    return(
      <AppBar className={this.props.classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={this.handleDrawerToggle}
            className={this.props.classes.menuButton}
          >
            {drawerIcon}
          </IconButton>

          <div className={this.props.classes.flex}>
            <Typography type="body2" style={{ color: '#FFFFFF', fontFamily: 'Montserrat', fontSize: '22px' }} >M2M Wallet</Typography>
          </div>

          <List>
            <ListItem>
              <ListItemIcon className={this.props.classes.iconStyle}>
                <Wallet />
              </ListItemIcon>
              <ListItemText primary={balance} className={this.props.classes.noPadding}/>
            </ListItem>
          </List>

          <a href="https://www.loraserver.io/lora-app-server/" target="loraserver-doc">
            <IconButton className={this.props.classes.iconButton}>
              <HelpCicle />
            </IconButton>
          </a>

          <Chip
            avatar={
              <Avatar>
                <AccountCircle />
              </Avatar>
            }
            label={this.props.user.username}
            onClick={this.onMenuOpen}
            classes={{
              avatar: this.props.classes.avatar,
              root: this.props.classes.chip,
            }}
          />
          <Menu
            id="menu-appbar"
            anchorEl={this.state.menuAnchor}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={this.onMenuClose}
          >
            <MenuItem component={Link} to={`/users/${this.props.user.id}/password`}>Change password</MenuItem>
            <MenuItem onClick={this.onLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(withRouter(TopNav));
