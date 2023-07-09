import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Img1 from "../images/img1.png";
import ChannelLogo from "../images/channel-logo.png";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";

const Container = styled.div`
  width: ${(props) => (props.type === "sm" ? "100%" : "360px")};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: ${(props) => props.type === "sm" && "15px"};
`;

const Image = styled.img`
  width: ${(props) => (props.type === "sm" ? "160px" : "100%")};
  height: ${(props) => (props.type === "sm" ? "90px" : "202px")};
  background-color: #999;
  border-radius: 12px;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => (props.type === "sm" ? "4px" : "16px")};
  align-items: start;
  gap: 12px;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;
const ChannelName = styled.h3`
  font-size: 13px;
  color: ${({ theme }) => theme.textSoft};
  margin: 8px 0px;
`;

const Info = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchChannel();
  }, [video.userId]);

  return (
  <Link to={`/video/${video._id}`} className="link">
      {channel && (
        <Container type={type}>
          <Image type={type} src={video.imgUrl} />
          <Details type={type}>
            <ChannelImage type={type} src={channel?.img} />
            <Texts>
              <Title>{video.title}</Title>
              <ChannelName>{channel?.name}</ChannelName>
              <Info>
                {video.views} views • {format(video.createdAt)}
              </Info>
            </Texts>
          </Details>
        </Container>
      )}
    </Link>
  );
};

export default Card;
