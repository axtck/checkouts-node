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

// sample data
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

// type for checkout
const CheckoutType = new GraphQLObjectType({
    name: "Checkout",
    description: "Represents a checkout",
    // declaring as functions is needed for accessibility
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

// type for user
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
            // pass parent and args to get id from args
            resolve: (parent, args) => checkouts.find(c => c.id === args.id)
        },
        // get all users in list
        users: {
            type: new GraphQLList(UserType),
            description: "List of all users",
            resolve: () => users
        },
        // get a single user by id argument
        user: {
            type: UserType,
            description: "A single user",
            resolve: (parent, args) => users.find(u => u.id === args.id)
        }
    })
});

// root mutation
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        // add a checkout via mutation
        addCheckout: {
            type: CheckoutType,
            description: "Add a checkout",
            // arguments needed for mutation
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                score: { type: GraphQLNonNull(GraphQLInt) },
                userId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const checkout = {
                    id: checkouts.length + 1,
                    name: args.name,
                    score: args.score,
                    userId: args.userId
                }
                checkouts.push(checkout); // add checkout to checkouts
                return checkout;
            }
        },
        addUser: {
            type: UserType,
            description: "Add a user",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const user = {
                    id: users.length + 1,
                    name: args.name,
                    age: args.age
                }
                checkouts.push(user);
                return user;
            }
        }
    })
});

// schema
const schema = new GraphQLSchema({
    query: RootQueryType, // query
    mutation: RootMutationType // mutation
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

const port = 5000;
app.listen(port, () => console.log(`Listening on ${port}`));