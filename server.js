const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const ExpressGraphQL = require("express-graphql");
const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt
} = require("graphql");

const app = express();
const PORT = 8000;

// import models for database
require('./models/post');

// server setup
app.use(cors());

// Parse middleware before handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

// Establish connection with mongoDB
mongoose
    .connect(`mongodb://${process.env.DB_HOST || 'localhost'}:27017/blogdatabase`, { useUnifiedTopology: true, useNewUrlParser: true  })
    .catch(e => {
        console.error('Connection error', e.message)
    })

// assign db connection to variable so we can check once open or error
let db = mongoose.connection;

// once connection is open you'll get success messsage
db.once('open', () => console.log('connected to the database'));

// You must make sure that you define all configurations BEFORE defining routes
require('./routes/postsRoute')(app);


/**
 * GraphQL implementation
 */

// Import the MongoDB PostModel to use for resolve functions
const PostModel = mongoose.model('posts');

//Define GraphQL Comment typedef
const CommentType = new GraphQLObjectType({
    name: "Comment",
    fields: {
        id: {type: GraphQLID},
        toId: {type: GraphQLInt},
        author: {type: GraphQLString},
        comment: {type: GraphQLString},
        date: {type: GraphQLString},
        vote: {type: GraphQLString}
    }
})

//Define GraphQL Post typedef
const PostType = new GraphQLObjectType({
    name: "Post",
    fields: {
        id: {type: GraphQLID},
        author: { type: GraphQLString },
        content: { type: GraphQLString },
        comments: {type: GraphQLList(CommentType)},
        createdAt: {type: GraphQLString},
        updatedAt: {type: GraphQLString}
    }
});

//Define the Schema for Post
const postSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            posts: {
                type: GraphQLList(PostType),
                resolve: (root, args, context, info) => {
                    return PostModel.find().exec();
                }
            },
            post: {
                type: PostType,
                args: {
                    id: {type: GraphQLNonNull(GraphQLID)} 
                },
                resolve: (root, args, context, info) => {
                    return PostModel.findById(args.id).exec();
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            createPost: {
                type: PostType,
                args: {
                    author: {type: GraphQLNonNull(GraphQLString)},
                    content: {type: GraphQLNonNull(GraphQLString)}
                },
                resolve: (root, args, context, info) => {
                    return PostModel.create(args);
                }
            },
            updatePost: {
                type: PostType,
                args: {
                    id: {type: GraphQLNonNull(GraphQLString)},
                    author: {type: GraphQLString},
                    content: {type: GraphQLString},
                },
                resolve: (root, args, context, info) => {
                    return PostModel.findByIdAndUpdate(args.id, args)
                }
            },
            deletePost: {
                type: PostType,
                args: {
                    id: {type: GraphQLNonNull(GraphQLString)},
                },
                resolve: (root, args, context, info) => {
                    return PostModel.findByIdAndDelete(args.id);
                }
            }
        }
    })
});

//Make endpoint for graphql 
app.use("/graphql", ExpressGraphQL({
    schema: postSchema,
    graphiql: true
}));

// Start server and listen on the variable PORT
app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`)
  });