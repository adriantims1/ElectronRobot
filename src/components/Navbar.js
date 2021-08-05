import React from "react";
import { makeStyles, Grid, Box, IconButton } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

import SettingsIcon from "@material-ui/icons/Settings";
import { Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { wsSocket, asSocket } from "../Utilities/WebSocket";

const styles = makeStyles((theme) => ({
  sidebar: {
    display: "flex",
    flexDirection: "column",
    height: "90%",
    width: "20%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  sidebarContent: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    marginTop: "3%",
    justifyContent: "center",
  },
  icons: {
    fontSize: "50px",
    margin: "10%",
    color: "grey",
  },
  active: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "8px",
    boxSizing: "border-box",
    "& $icons": {
      color: "white",
    },
    "& $iconText": {
      color: "white",
    },
  },
  iconText: {
    color: "black",
    paddingRight: "10%",
  },
  iconButton: { "&:hover": { backgroundColor: "transparent" } },
  NavLink: {
    textDecoration: "none",
  },
}));

export default function SideBar({ setConnected }) {
  const classes = styles();

  return (
    <Grid item className={classes.sidebar}>
      <Box
        display="flex"
        className={`${classes.sidebar} ${classes.sidebarContent}`}
      >
        <img
          src="https://res.cloudinary.com/dtkgfy2wk/image/upload/v1620954709/logo_fuhdgl.svg"
          style={{ height: "75px", width: "100px" }}
        ></img>
      </Box>
      <div className={`${classes.sidebar} ${classes.sidebarContent}`}>
        <NavLink
          to="/home"
          activeClassName={classes.active}
          className={classes.NavLink}
        >
          <IconButton className={classes.iconButton}>
            <HomeIcon className={classes.icons} />
            <Typography
              display="inline"
              style={{ textDecoration: "none" }}
              className={classes.iconText}
            >
              Home
            </Typography>
          </IconButton>
        </NavLink>
        <NavLink
          to="/trade"
          activeClassName={classes.active}
          className={classes.NavLink}
        >
          <IconButton className={classes.iconButton}>
            <TrendingUpIcon className={classes.icons} />
            <Typography
              display="inline"
              style={{ textDecoration: "none" }}
              className={classes.iconText}
            >
              Trade
            </Typography>
          </IconButton>
        </NavLink>

        <NavLink
          to="/setting"
          activeClassName={classes.active}
          className={classes.NavLink}
        >
          <IconButton
            className={classes.iconButton}
            style={{ marginBottom: "10%" }}
          >
            <SettingsIcon className={classes.icons} />
            <Typography
              display="inline"
              style={{ textDecoration: "none" }}
              className={classes.iconText}
            >
              Settings
            </Typography>
          </IconButton>
        </NavLink>

        <IconButton
          className={classes.iconButton}
          onClick={() => {
            wsSocket.close();
            asSocket.close();
            localStorage.clear();
            setConnected(false);
          }}
        >
          <ExitToAppIcon className={classes.icons} />
          <Typography
            display="inline"
            style={{ textDecoration: "none" }}
            className={classes.iconText}
          >
            Logout
          </Typography>
        </IconButton>
      </div>
    </Grid>
  );
}
