import React from 'react'
import { createStyles } from '@mantine/core';
import { Footer, Group, Text } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  root: {
      paddingTop: theme.spacing.xl * 1.5,
      paddingBottom: theme.spacing.xl * 1.5,
      paddingRight: theme.spacing.xs * 1.5,
      marginLeft:  theme.spacing.xl * 1.5,
      height: "100px",
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#E1E1E1",

      [theme.fn.smallerThan("sm")]: {
          height: "250px",
      },
  }    
}));

function FooterComponent() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
                <Group position="apart" spacing="xl">
                    <Text size="sm"><span style={{ color: 'gray' }}>Created with 🦙</span></Text>
                    <Text size="sm"><span style={{fontWeight: 'bolder'}}>© 2022</span></Text>
                </Group>
    </div>
  )
}

export default FooterComponent