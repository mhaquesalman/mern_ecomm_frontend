const CommentItem = ({ comments }) => {
  return comments.map((comment) => (
    <div key= {comment._id} className="card" style={bg}>
        <div className="row">
          <img src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" style={image}/> 
          <h5 style={{textTransform: "uppercase", color: "#fff"}}>{comment.user.name}</h5>
        </div>
        <div style={body}>{comment.commentBody}</div>
        <div style={body}><span style={{color: "#F1C40F", fontWeight: "bold"}}>{comment.commentRating}</span> 
        <span className="fa fa-star" style={{ color: "#f5d04d" }}></span></div>
    </div>
  ));
};

export default CommentItem;

const image = {
  width: "30px",
  height: "30px",
  marginLeft: "15px"
}

const body = {
  marginLeft: 30,
  fontSize: "16px",
  color: "#fff"
}

const bg = {
  margin: "10px", 
  padding: "10px", 
  background: "grey", 
  border: "2px solid #333"
}

/**    <div>
      <h5>{comment.user.name}</h5>
      <p>{comment.commentBody}</p>
      <p>Rating: {comment.commentRating}</p>
    </div> */
