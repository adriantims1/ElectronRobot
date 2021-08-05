import React from "react";
import { Typography, Box } from "@material-ui/core";

import NotFound from "../assets/404.svg";

function Error() {
  return (
    <>
      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <img src={NotFound} height="40%" />
        <Typography variant="h3" style={{ margin: "10px 0px" }}>
          Something went wrong
        </Typography>
        <Typography>Restart the program or contact us</Typography>
      </Box>
    </>
  );
}

export default Error;
