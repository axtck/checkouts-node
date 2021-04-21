const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');

const app = express();

const checkouts = [
    { id: 1, name: "first checkout", score: 40 },
    { id: 2, name: "first checkout", score: 40 },
    { id: 3, name: "first checkout", score: 40 },
    { id: 4, name: "first checkout", score: 40 },
    { id: 5, name: "first checkout", score: 40 }
];

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Test",
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => "Hello world"
            }
        })
    })
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

const port = 5000;
app.listen(port, () => console.log(`Listening on ${port}`));