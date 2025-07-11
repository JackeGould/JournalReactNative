import { useQuery } from '@apollo/client'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { gql } from "@apollo/client";

const READ_ALL_POSTS = gql`
  query PostsByMe {
    postsByMe {
      _id
      title
      message
    }
  }
`;


type PostItem = {
  title: string
  message: string
  _id: string
}

type QueryData = {
  postsByMe: PostItem[]
}

const Test = () => {
  const { loading, data } = useQuery<QueryData>(READ_ALL_POSTS)

  if (loading) {
    console.log("Loading!")

    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  const { postsByMe } = data || { postsByMe: [] }

  // console.log(postsByMe)
  // Console log to view data how data is packaged

  return (
    <TouchableOpacity>
      {postsByMe.map((item: PostItem) => (
        <View key={item._id}>
          <Text>{`Title: ${item.title}`}</Text> 
          <Text>{`Message: ${item.message}`}</Text>
        </View>
      ))}
    </TouchableOpacity>
  )
}

export default Test

const styles = StyleSheet.create({})