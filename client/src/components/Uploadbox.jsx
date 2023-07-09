import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #00000090;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Wrapper = styled.div`
  width: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  transform: rotate(45deg);
  font-size: 34px;
  font-weight: 400;
`;

const Title = styled.h1`
  font-size: 30px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 8px;
  background-color: transparent;
`;
const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 8px;
  background-color: transparent;
`;
const Button = styled.button`
  width: max-content;
  padding: 10px 20px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;

  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  align-self: center;

  &:hover {
    background-color: ${(props) => props.type === "allow" && "#3ea6ff"};
    color: ${(props) => props.type === "allow" && "white"};
    cursor: pointer;
  }
  &:disabled {
    cursor: not-allowed;
  }
`;
const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;
const Uploadbox = ({ setOpenVDB }) => {
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [uploaded, setUploaded] = useState(0);

  const navigate = useNavigate();

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  //console.log(tags);
  //console.log(uploaded);

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;

    let storageRef;

    if (urlType === "imgUrl") {
      storageRef = ref(storage, "images/" + fileName);
    } else {
      storageRef = ref(storage, "videos/" + fileName);
    }

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress.toFixed(2) + "% done");
        urlType === "imgUrl"
          ? setImgPerc(Math.floor(progress))
          : setVideoPerc(Math.floor(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            //console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("File available at", downloadURL);
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });

          setUploaded(uploaded + 1);
        });
      }
    );
  };

  //console.log(inputs);

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/videos", { ...inputs, tags });
      setOpenVDB(false);
      res.status === 200 && navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpenVDB(false)}>+</Close>
        <Title>Upload a New Video</Title>
        <Label>Video:</Label>
        {videoPerc > 0 ? (
          videoPerc < 100 ? (
            "Uploading: " + videoPerc + "%"
          ) : (
            "Uploading: done."
          )
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <Label>Thumbnail:</Label>
        {imgPerc > 0 ? (
          imgPerc < 100 ? (
            "Uploading: " + imgPerc + "%"
          ) : (
            "Uploading: done."
          )
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <Input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <Desc
          type="text"
          name="desc"
          placeholder="Description"
          rows="8"
          onChange={handleChange}
        />
        <Input
          type="text"
          name="tags"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />
        <Button
          type={uploaded < 2 ? "not" : "allow"}
          disabled={uploaded < 2}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Uploadbox;
