import React, { useRef, useState, useCallback } from 'react'
import Navbar from '../components/Navbar';
import { Grid, Paper, Box, Typography, ButtonGroup, Button, IconButton, TextField, Dialog, DialogTitle} from '@mui/material'
import Webcam from 'react-webcam'
import { Camera, Folder, PhotoCamera, Send } from '@mui/icons-material';

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

const Picture = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<null | string>(null);
  const [cameraOpen, setCameraOpen] = useState(false)

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot({ width: cameraWidth, height: cameraHeight });
      setImgSrc(imageSrc);
    }
  }, [webcamRef, setImgSrc]);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0]
    if (!fileObj) return
    console.log(fileObj)
    setImgSrc(URL.createObjectURL(fileObj))
    console.log(URL.createObjectURL(fileObj))
  }

  const handleSubmit = () => {

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
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{
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
        <CameraDlg
          open={cameraOpen}
          onClose={handleCameraClose}
        />
      </Grid>
    </>
  );
};


interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

const CameraDlg = (props: SimpleDialogProps) => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose("");
  };

  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<null | string>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot({ width: cameraWidth, height: cameraHeight });
      setImgSrc(imageSrc);
      if (imageSrc) {
        onClose(imageSrc)
      }
    }
  }, [webcamRef, setImgSrc]);

  return (
    <Dialog onClose={handleClose} open={open}
      sx={{
        maxWidth: "90vw"
      }}
    >
      <DialogTitle>
        <Typography
          color='primary'
          variant='h3'
          component='h3'
        >
          Capture image from camera
        </Typography>
      </DialogTitle>
      <Webcam
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
      <Button color="primary" variant="text" component="label" endIcon={
        <Camera/>
      }
        onClick={capture}
      >
        Capture
        {/* <input hidden accept="image/*" type="file" /> */}
      </Button>
    </Dialog>
  );
}

export default Picture