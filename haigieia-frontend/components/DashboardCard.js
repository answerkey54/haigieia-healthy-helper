import { Grid } from '@mantine/core'
import React from 'react'

function DashboardCard({component, span=4}) {

  return (
    <Grid.Col span={span}>
        {component}
    </Grid.Col>
  )
}

export default DashboardCard