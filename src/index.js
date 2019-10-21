import { GraphQLServer } from 'graphql-yoga'
import users from './assets/user.json'
import posts from './assets/posts.json'
import comments from './assets/comments.json'
// scalar type String Int float ID Boolean these five types are data type in GraphQL
// type definition
const typeDefs = `
      type Query{
        posts(title:String):[Post]!
        users(name:String):[User]!
      }

      type User{
        id:ID!
        name:String!
        username:String!
        email:String!
        address:Address!
        posts:[Post]!
      }

      type Address{
        street:String
        suite:String
        city:String
        zipcode:String
        geo:GEO
      }

      type GEO{
        lat:Float
        lng:Float
      }
      type Post {
        id:ID!
        title:String!
        body:String!
        userId:User!
      }
`

// Resolvers

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.name) {
        return users
      }
      return users.filter(user =>
        user.name.toLowerCase().includes(args.name.toLowerCase())
      )
    },
    posts(parent, args, ctx, info) {
      if (!args.title) {
        return posts
      }
      return posts.filter(post => post.title.toLowerCase().includes(args.title))
    }
  },
  Post: {
    userId(parent, args, ctx, info) {
      return users.find(user => user.id === parent.userId)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.userId === parent.id)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('GraphQL server is running on port 4000')
})
