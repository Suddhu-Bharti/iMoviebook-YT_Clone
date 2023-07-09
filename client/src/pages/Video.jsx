import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ShareIcon from "@mui/icons-material/Share";
import React, { useEffect } from "react";
import { styled } from "styled-components";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like, share, view } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import { loadSuccess, subscribed, unsubscribed } from "../redux/channelSlice";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 7;
`;

const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
  align-items: center;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;


const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const ChannelLogo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ChannelDetails = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;
const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 13px;
`;
const Description = styled.p`
  font-size: 14px;
  text-align: justify;
`;

const Subscribe = styled.button`
  background-color: ${(props)=>props.type==="sub"? "#cc1a00" : "gray"};
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 480px;
  width: 100%;
  object-fit: cover;

`

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const { currentChannel } = useSelector((state) => state.channel);
  const dispatch = useDispatch();

  const location = useLocation();
  //console.log(location);
  const videoId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${videoId}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        await axios.put(`/videos/view/${videoRes.data._id}`)
        //console.log(videoRes.data);
        //console.log(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        dispatch(loadSuccess(channelRes.data));
        dispatch(view());
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [videoId, dispatch]);

  const handleLike = async () => {
    try {
      await axios.put(`/users/like/${currentVideo._id}`);
      dispatch(like(currentUser._id));
    } catch (err) {
      console.log(err);
    }
  };
  const handleDislike = async () => {
    try {
      await axios.put(`/users/dislike/${currentVideo._id}`);
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleShare = async () => {
    try {
      await axios.put(`/users/share/${currentVideo._id}`);
      dispatch(share());
    } catch (err) {
      console.log(err);
    }
  };

  const handleSub = async () => {
    try {
      if (currentUser.subscribedUsers.includes(currentChannel._id)) {
        await axios.put(`/users/unsub/${currentChannel._id}`);
        dispatch(unsubscribed());
      } else {
        await axios.put(`/users/sub/${currentChannel._id}`);
        dispatch(subscribed());
      }
      dispatch(subscription(currentChannel._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Content>
        <VideoWrapper>
         <VideoFrame src={currentVideo.videoUrl} controls autoPlay/>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo.views} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOutlinedIcon />
              )}
            </Button>
            <Button onClick={handleShare}>
              <ShareIcon /> {currentVideo.shares}
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        {currentChannel && (
          <Channel>
            <ChannelInfo>
              <ChannelLogo
                src={
                  currentChannel.img ||
                  "https://th.bing.com/th/id/R.4362365699fbc24a47b05de3e8e1d84a?rik=yFr5JgKOPmZRHw&riu=http%3a%2f%2fbxvpn.com%2fimages%2fuserIcon.png&ehk=L8rUr4VsQBoCAro1%2fMdJoRnyJSfAyKe3HWu3fZc1CLk%3d&risl=&pid=ImgRaw&r=0"
                }
              />
              <ChannelDetails>
                <ChannelName>{currentChannel.name}</ChannelName>
                <ChannelCounter>
                  {currentChannel.subscribers} subscribers
                </ChannelCounter>
                <Description>{currentVideo.desc}</Description>
              </ChannelDetails>
            </ChannelInfo>
            {currentUser.subscribedUsers?.includes(currentChannel._id) ? (
              <Subscribe type="unsub" onClick={handleSub}>
                SUBSCRIBED
              </Subscribe>
            ) : (
              <Subscribe type="sub" onClick={handleSub}>
                SUBSCRIBE
              </Subscribe>
            )}
          </Channel>
        )}
        <Hr />
        <Comments videoId={currentVideo._id} userImg={currentUser.img}/>
      </Content>
      <Recommendation tags={currentVideo.tags}/>
    </Container>
  );
};

export default Video;
