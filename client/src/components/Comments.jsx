import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Comment from "./Comment";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { addComment, commentFetchSuccess } from "../redux/commentSlice";

const Container = styled.div`
  width: 100%;
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  background-color: transparent;
  outline: none;
  padding: 5px;
  color: ${({ theme }) => theme.text};
  width: 80%;
`;

const Comments = ({ videoId, userImg }) => {

  const [newComment, setNewComment] = useState("");
  const { currentComments } = useSelector((state)=>state.comment);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        dispatch(commentFetchSuccess(res.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, [videoId, dispatch]);

  const handleComment = async () => {
    // console.log("send...");
    try {
      const res = await axios.post("/comments", {
        videoId,
        comment: newComment,
      });
      setNewComment("");
      dispatch(addComment(res.data));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container>
      <NewComment>
        <Avatar src={userImg} />
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <SendIcon style={{ cursor: "pointer" }} onClick={handleComment} />
      </NewComment>
      {currentComments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
