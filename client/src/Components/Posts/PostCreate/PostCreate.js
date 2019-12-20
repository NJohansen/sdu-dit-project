import React, { Component } from "react";
import "./PostCreate.css";
import postServices from '../../../services/postServices';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default class PostCreate extends Component {
  constructor(props) {
    super(props);
    this.state = { author: "", content: "", errorMsg: "", isSuccesfull: true };
  }
  onAuthorInput = event => {
    this.setState({ author: event.target.value });
  };
  onPostInput = event => {
    this.setState({ content: event.target.value });
  };

  newPost = async () => {
    let mutationQuery = `
    mutation createPost{
      createPost(author: "${this.state.author}", content:"${this.state.content}"){
        id,
        content
      }
    }`;

    await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: mutationQuery})
    })
    .then(r => console.log(r.json()));
  }

  onCreatePost = async () => {
    if (this.state.author.length < 1 || this.state.content.length < 1) {
      console.log("error msg");
    } else {

      let data = {
        author: this.state.author,
        content: this.state.content
      }

      //The graphql way
      this.newPost();
      // The REST way
      //await postServices.createPost(data);
      this.setState({ author: "", content: "" });
      window.location.href = "/PostList"
    }
  };

  render() {
    return (
      <div className="postContext">
        <div className="postCreateContainer">
          <div className="postCreateTitle">Write your post here!</div>
          <div className="contentInputContainer">
            <TextField
              className="contentInput"
              label="Author"
              onChange={event => this.onAuthorInput(event)}
              value={this.state.author}
            ></TextField>
          </div>
          <div className="contentInputContainer">
            <TextField
              className="contentInput"
              multiline
              onChange={event => this.onPostInput(event)}
              label="Content"
              value={this.state.content}
            ></TextField>
          </div>

          <Button onClick={this.onCreatePost} variant="contained">
            Create Post
          </Button>
        </div>
      </div>
    );
  }
}
