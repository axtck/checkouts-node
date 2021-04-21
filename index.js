const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const app = express();

const users = [
    { id: 1, name: "Alexander", age: 22 },
    { id: 2, name: "Hendrik", age: 20 },
    { id: 3, name: "Stephaan", age: 50 }
]

const checkouts = [
    { id: 1, name: "first checkout Alexander", score: 40, userId: 1 },
    { id: 2, name: "second checkout Alexander", score: 40, userId: 1 },
    { id: 3, name: "first checkout Stephaan", score: 40, userId: 3 },
    { id: 4, name: "first checkout Hendrik", score: 40, userId: 2 },
    { id: 5, name: "second checkout Stephaan", score: 40, userId: 3 }
];

const CheckoutType = new GraphQLObjectType({
    name: "Checkout",
    description: "Represents a checkout",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        score: { type: GraphQLNonNull(GraphQLInt) },
        userId: { type: GraphQLNonNull(GraphQLInt) },
        // find user linked to checkout by id 
        user: {
            type: UserType,
            resolve: (checkout) => {
                return users.find(u => u.id === checkout.userId);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: "User",
    description: "Represents a user",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
        // get all checkouts by specific user
        checkouts: {
            type: GraphQLList(CheckoutType),
            resolve: (user) => {
                return checkouts.filter(c => c.userId === user.id);
            }
        }
    })
});

// root query
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        // get all checkouts in list
        checkouts: {
            type: new GraphQLList(CheckoutType),
            description: "List of all checkouts",
            resolve: () => checkouts
        },
        // get a single checkout by id argument
        checkout: {
            type: CheckoutType,
            description: "A single checkout",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => checkouts.find(c => c.id === args.id)
        },
        // get all users in list
        users: {
            type: new GraphQLList(UserType),
            description: "List of all users",
            resolve: () => users
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

const port = 5000;
app.listen(port, () => console.log(`Listening on ${port}`));