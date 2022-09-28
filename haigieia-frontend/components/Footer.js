import React from 'react'
import { Footer, Group, Text } from '@mantine/core'

function FooterComponent() {
  return (
    <Footer height={60} p="md">
                <Group position="apart" spacing="xl">
                    <Text size="md"><span style={{ color: 'gray' }}>Created with 🦙</span></Text>
                    <Text size="sm"><span style={{fontWeight: 'bolder'}}>© 2022</span></Text>
                </Group>
    </Footer>
  )
}

export default FooterComponent