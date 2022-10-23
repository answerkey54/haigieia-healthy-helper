import React from "react";
import { Box, createStyles, useMantineTheme } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        alignText: "center",
    }
}));

const sizes = {
    xs: 16,
    sm: 20,
    md: 26,
    lg: 32,
    xl: 40,
  };
  

function EmojiIcon({ size = "xl", emoji, radius = "md", color }) {
    const theme = useMantineTheme();
    const { classes, cx } = useStyles();

    return <Box className={cx(classes.root)}
    style={{ height: theme.fn.size({ size, sizes }), width:  theme.fn.size({ size, sizes }), fontSize:  theme.fn.size({ size, sizes }) / 2, backgroundColor: theme.fn.lighten(color,0.6) }}>{emoji}</Box>;
}

export default EmojiIcon;
