import React from 'react'
import { Footer, Group, Text } from '@mantine/core'

function FooterComponent() {
  return (
    <Footer height={40} p="xs">
                <Group position="apart" spacing="xl">
                    <Text size="sm"><span style={{ color: 'gray' }}>Created with 🦙</span></Text>
                    <Text size="sm"><span style={{fontWeight: 'bolder'}}>© 2022</span></Text>
                </Group>
    </Footer>
  )
}

export default FooterComponent