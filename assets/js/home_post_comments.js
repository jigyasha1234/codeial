{
  let createComment = function () {
    let newCommentForm = $("#new-comment-form");
    newCommentForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/comments/create",
        data: newCommentForm.serialize(),
        success: function (data) {
          let newComment = newCommentDom(data.data.comment);
          $("#posts-comments-container>ul").prepend(newComment);
          deleteComment($(` .delete-comment-button`, newComment));
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  };

  // method to create a comment in DOM

  let newCommentDom = function (comment) {
    return $(`
    <li id="comment-${comment._id}">
    <div class="comments">      
      <table style="width:100%">
        <tr>
          <td style="width:130px"><b>${comment.content}</b></td>                  
          <td style="width:35px">
          <small>
         <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
         0 Likes
         </a>
          </small>
          </td>
          <td style="width:35px;">
            <small>
              <a href="/comments/destroy/${comment._id}" class="delete-comment-button"> X </a>
            </small>  
          </td>
          <td style="width:60px;"><small>${comment.user.name}</small></td>  
        </tr>       
      </table>
    </div>
  </li>
    `);
  };

// method to delete comment

let deleteComment = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#comment-${data.data.comment_id}`).remove();
            },
            error: function(err){console.log(err);}
        });
    });
}
createComment();
console.log("inside comment ajax file");

}
