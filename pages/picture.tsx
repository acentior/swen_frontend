import type { NextPage } from 'next'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import Navbar from '../components/Navbar';
import { Grid, Paper, Box, Typography, ButtonGroup, Button, IconButton, TextField, Dialog, DialogTitle} from '@mui/material'
import Webcam from 'react-webcam'
import { Camera, Folder, Google, PhotoCamera, Send } from '@mui/icons-material';
import { useGeolocated } from 'react-geolocated'
import { newCluster, newImage, newPost } from '../apis';
import { Input } from '../constants';

const cameraWidth = 720
const cameraHeight = 720
const aspectRatio = cameraWidth / cameraHeight

const videoConstraints: MediaTrackConstraints = {
  aspectRatio: aspectRatio,
  // width: {
  //   min: cameraWidth
  // },
  // height: {
  //   min: cameraHeight
  // },
  // facingMode: 'user'
  // width: 1280,
  // height: 720,
  // facingMode: "user"
};

const Picture: NextPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<null | string>(null);
  const [cameraOpen, setCameraOpen] = useState(false)
  const [comment, setComment] = useState("")

  const {
    coords,
    getPosition,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
  } = useGeolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot({ width: cameraWidth, height: cameraHeight });
      setImgSrc(imageSrc);
    }
  }, [webcamRef, setImgSrc]);

  const handleInputChange = (type: Input) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    console.log(ev.target.value)
    switch (type) {
      case Input.Comment:
        setComment(ev.target.value)
        break;
      
      default:
        break;
    }
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0]
    if (!fileObj) return
    console.log(fileObj)
    setImgSrc(URL.createObjectURL(fileObj))
    console.log(URL.createObjectURL(fileObj))
  }

  const handleSubmit = ({imgSrc, comment}: {imgSrc: string | null, comment: string}) => (ev: React.FormEvent<HTMLFormElement>) => {
    // getPosition()
    ev.preventDefault()
    if (imgSrc === null) {
      alert(`image is not yet set`)
      return
    }
    if (isGeolocationAvailable) {
      if (isGeolocationEnabled) {
        console.log(coords)
        if (coords) {
          newCluster({ latitude: coords?.latitude, longitude: coords.longitude })
            .then((cluster_id: string) => {
              console.log(`new cluster added, id: ${cluster_id}`)
              return newImage({ url: imgSrc })
                .then((content: string) => {
                  console.log(`new image added, id: ${content}`)
                  return newPost({ cluster_id, comment, content})
                })
                .then((data) => {
                  console.log(data)
                  alert("new post success")
              })
            })
            .catch((reason: any) => {
            console.log(reason)
          })
        }
      } else {
        alert("Please enable location on your browser")
      }
    } else {
      alert("Please update or change your browser")
    }
  }


  const handleCameraOpen = () => {
    setCameraOpen(true)
  }

  const handleCameraClose = (imageSrc: string) => {
    setCameraOpen(false)
    if (imageSrc !== "") {
      setImgSrc(imageSrc)
    }
  }

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      permissionStatus.onchange = getPosition
    });
  
    return () => {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        permissionStatus.onchange = null
      });
    }
  }, [])
  

  return (
    <>
      <Navbar title='Take picture' />
      <Grid container spacing={0} component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            background: "linear-gradient(to bottom right, #7d59bd, #5241a0) no-repeat center fixed",
            backgroundSize: "cover",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: 'column',
            p: 4,
          }}
          component={Paper}
          elevation={6}
          square
        >
          {imgSrc && (
            <Box
              component="img"
              alt="image"
              src={imgSrc}
              sx={{
                maxWidth: '100%',
                maxHeight: '60vh',
                display: 'block'
              }}
            />
          )}

          <ButtonGroup color='secondary' aria-label="medium secondary button group" sx={{
            m: 3
          }}>
            <Button color="secondary" variant="outlined" component="label" startIcon={
              <Folder/>
            }>
              local
              <input hidden accept="image/*" type="file" onChange={handleFileChange}/>
            </Button>
            <Button color="secondary" variant="outlined" component="label" endIcon={
              <Camera/>
            }
              onClick={handleCameraOpen}
            >
              camera
              {/* <input hidden accept="image/*" type="file" /> */}
            </Button>
          </ButtonGroup>
          {/* <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}
            videoConstraints={videoConstraints}
            screenshotQuality={1}
            style={{
              width: '100%'
            }}
          />
          <button onClick={capture}>Capture photo</button> */}
        </Grid>
        <Grid item xs={12} md={6} component={Paper} elevation={6} square sx={{
          display: 'flex',
          justifyContent: "center",
          alignItems: 'center',
        }}>
          <div>{`${isGeolocationAvailable}-`}</div>
          <div>{`${isGeolocationEnabled}-`}</div>
          <div>{`${coords}-`}</div>
          <Box component="form" noValidate onSubmit={handleSubmit({imgSrc, comment})} sx={{
            py: 8,
            px: 1,
            // display: 'flex',
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: 'center',
            position: "relative",
            width: "80%"
          }}>
            <TextField
              margin="normal"
              fullWidth
              id="comment"
              label="comment"
              name="comment"
              autoComplete="comment"
              variant="standard"
              multiline
              autoFocus
              onChange={handleInputChange(Input.Comment)}
              value={comment}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              endIcon={
                <Send/>
              }
            >
              Post
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};


interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}


export default Picture