import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen 
        name='index'
        options={{
            title: 'Home',
            headerShown: false
        }}
      />
      <Tabs.Screen 
        name='newEntry'
        options={{
            title: 'New Entry',
            headerShown: false
        }}
      />
      <Tabs.Screen 
        name='profile'
        options={{
            title: 'Profile',
            headerShown: false
        }}
      />
    </Tabs>
  )
}

export default _layout