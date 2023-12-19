{
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $('#posts-list-container>ul').prepend(newPost);
          deletePost($(` .delete-post-button`, newPost));
        },
        error: function (error) {
          console.log(error);
        },
      });

    });
  };

  //method to create a post in DOM

  let newPostDom = function (post) {
    return $(`
    <li id="post-${post._id}">
    <div>
      <div class="post-style">  ${post.content} </div>
      <br />
      <div class="create-and-delete">
        <div class="delete">
          <a href="/posts/destroy/${post._id}" id="delete-post-button"> delete post</a>
        </div>
        <div class="created-by">Created By: ${post.user.name}</div>
      </div>
      <br/>
    </div>
    <div class="post-comments">
      <div>
            <form action="/comments/create" method="post">
                <input
                type="text"
                name="content"
                placeholder="type your comment here..."
                required
            />
            <input type="hidden" name="post" value=${post._id}/>
            <input type="submit" value="Add comment" />
            </form>
      </div>
    <div class="post-comments-list">
        <ul class="post-comments-list-${post._id}"></ul>
    </div>
  </li>
    `);
  };

  let deletePost = function(deleteLink){
    $(deletelink).click(function(e){
        e.preventDefault();
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
    });
  }
  createPost();
  console.log("hii jigyasha");
}
