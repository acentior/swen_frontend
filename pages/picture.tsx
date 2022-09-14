import type { NextPage } from 'next'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import Navbar from '../components/Navbar';
import { Grid, Paper, Box, Typography, ButtonGroup, Button, TextField, Dialog, DialogTitle} from '@mui/material'
import Webcam from 'react-webcam'
import { Camera, Folder, Send } from '@mui/icons-material';
import { useGeolocated } from 'react-geolocated'
import { getAllClusters, newCluster, newImage, newPost } from '../apis';
import { Input } from '../constants';
import { useSnackbar } from 'notistack';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { isWithinMi } from '../helpers';


const cameraWidth = 720
const cameraHeight = 720
const aspectRatio = cameraWidth / cameraHeight

const videoConstraints: MediaTrackConstraints = {
  aspectRatio: aspectRatio,
};

const Picture: NextPage = () => {
  const [imgSrc, setImgSrc] = useState<null | string>(null);
  const [cameraOpen, setCameraOpen] = useState(false)
  const [comment, setComment] = useState("")
  const { enqueueSnackbar } = useSnackbar();

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
    ev.preventDefault()
    if (imgSrc === null) {
      enqueueSnackbar(`image is not yet set`, { variant: "error" })
      return
    }
    if (isGeolocationAvailable) {
      if (isGeolocationEnabled) {
        console.log(coords)
        if (coords) {
          getAllClusters().then((data) => {
            return data.filter((cluster) => {
              if (dayjs(cluster.expires, 'MM/DD/YYYY HH:mm:ss').isAfter(dayjs())) return true
              else if (isWithinMi([Number(cluster.latitude), Number(cluster.longitude)], [coords.latitude, coords.longitude], 1)) return true
              else false
            })
          }).then((data) => {
            if (data.length > 0) {
              return data[0].id.toString()
            } else {
              return newCluster({ latitude: coords?.latitude.toString(), longitude: coords.longitude.toString() })
            }
          }).then((cluster_id: string) => {
              console.log(`new cluster added, id: ${cluster_id}`)
              return newImage({ url: imgSrc })
                .then((content: string) => {
                  console.log(`new image added, id: ${content}`)
                  return newPost({ cluster_id, comment, content})
                })
                .then((data) => {
                  console.log(data)
                  enqueueSnackbar(`Posted successfully`, { variant: "success" })
                })
            })
            .catch((reason: any) => {
              enqueueSnackbar(`Post failed ${reason}`, { variant: "error" })

            console.log(reason)
          })
        }
      } else {
        enqueueSnackbar(`Please enable location on your browser`, { variant: "error" })
      }
    } else {
      enqueueSnackbar(`Please update or change your browser`, { variant: "error" })
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
        </Grid>
        <Grid item xs={12} md={6} component={Paper} elevation={6} square sx={{
          display: 'flex',
          justifyContent: "center",
          alignItems: 'center',
        }}>
          <Box component="form" noValidate onSubmit={handleSubmit({imgSrc, comment})} sx={{
            py: 8,
            px: 1,
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
      </Button>
    </Dialog>
  );
}

export default Picture