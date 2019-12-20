import React, { Component } from "react";
import "./PostList.css";
import PostCard from "../../Cards/PostCard";
import postServices from '../../../services/postServices';

export default class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: false,
      newPosts: []
    };
  }
  componentDidMount() {
    this.getPosts();
  }

  getPosts = async () => {
    // The REST way
    let resREST = await postServices.getPosts();
    let getAllPostsQuery = `{
      posts{
        id,
        createdAt,
        author,
        content,
      }
    }`;

    let resGraphql = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: getAllPostsQuery})
    }).then(r => r.json());

    // The REST way
    //this.setState({ posts: resREST });
    
    //Uses the response from Graphql
    this.setState({ posts: resGraphql.data.posts });
    console.log(resGraphql.data.posts);
  };

  renderContent = () => {
    if (this.state.isLoading) {
      return (
        <div className="spinnerContainer">
          <div className="loader"></div>
          <div>Loading...</div>
        </div>
      );
    } else {
      return this.renderList();
    }
  };

  renderList = () => {
    if (this.state.posts.length > 0) {
      return (
        <div>
          <div className="postContainer">
            {this.state.posts.map(v => {
              return (
                <div key={v.id}>
                  <PostCard
                    key={v.id}
                    id={v.id}
                    date={new Date(parseInt(v.createdAt)).toDateString()}
                    author={v.author}
                    content={v.content}
                  ></PostCard>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if(!this.state.posts) {
      return (
        <div className="spinnerContainer">
          <img className="failedImg" alt="failed" src="/SWW.jpeg"></img>
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderContent()}</div>;
  }
}
