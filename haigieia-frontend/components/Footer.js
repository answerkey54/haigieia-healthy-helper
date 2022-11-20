import React from 'react'
import { createStyles } from '@mantine/core';
import { Footer, Group, Text } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  root: {
      paddingRight: theme.spacing.xs * 1.5,
      paddingLeft:  "80px",
      height: "40px",
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],

      [theme.fn.smallerThan("xs")]: {
          height: "40px",
          paddingLeft: theme.spacing.xs * 1.5,
      },
  }    
}));

function FooterComponent() {
  const {classes} = useStyles();

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