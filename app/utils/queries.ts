import { gql } from "@apollo/client";

export const READ_ALL_POSTS = gql`
  query PostsByMe {
    postsByMe {
      _id
      title
      message
    }
  }
`;