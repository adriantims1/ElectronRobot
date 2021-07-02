import React from "react";
import { makeStyles, Grid, Box, IconButton } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

import SettingsIcon from "@material-ui/icons/Settings";
import { Typography } from "@material-ui/core";
import BarChartIcon from "@material-ui/icons/BarChart";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const styles = makeStyles((theme) => ({
  sidebar: {
    display: "flex",
    flexDirection: "column",

    height: "100%",
    width: "20%",
    justifyContent: "space-between",
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

export default function SideBar() {
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
        to="/statistic"
        activeClassName={classes.active}
        className={classes.NavLink}
      >
        <IconButton className={classes.iconButton}>
          <BarChartIcon className={classes.icons} />
          <Typography
            display="inline"
            style={{ textDecoration: "none" }}
            className={classes.iconText}
          >
            Statistic
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
      <NavLink to="/logout" className={classes.NavLink}>
        <IconButton className={classes.iconButton}>
          <ExitToAppIcon className={classes.icons} />
          <Typography
            display="inline"
            style={{ textDecoration: "none" }}
            className={classes.iconText}
          >
            Logout
          </Typography>
        </IconButton>
      </NavLink>
    </Grid>
  );
}
