import { buildSchema } from "graphql";

const schema = buildSchema(`

     type Group {
        _id: ID!
        name: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        phone: String!
        status: String!
        groups: [Group!]!
    }
    type AuthData {
        token: String!
        userId: String!
    }
   
    input UserInputData {
        email: String!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        password: String!
        group:[GroupInput]
    }

    input GroupInput {
       name: String!

    }

    type RootQuery {
       login(email: String!, password: String!, group:GroupInput): AuthData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
export default schema;
