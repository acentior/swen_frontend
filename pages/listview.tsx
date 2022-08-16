import type { NextPage } from 'next'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import Navbar from '../components/Navbar';
import { Grid, Paper, Box, Typography, ButtonGroup, Button, IconButton, TextField, Dialog, DialogTitle, ListItem, ListItemButton, ListItemText} from '@mui/material'
import Webcam from 'react-webcam'
import { Camera, Folder, PhotoCamera, Send } from '@mui/icons-material';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Virtuoso } from 'react-virtuoso'
import { geoReverse, uploadedImages } from '../apis';
import { MediaPost, MediasResponse } from '../constants';
import { LatLngExpression } from 'leaflet';
import uploads_get from '../mock/uploads_get.json'
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

const imageSize = 120
const testImageURL = 'https://images.unsplash.com/photo-1533827432537-70133748f5c8'

const Picture: NextPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<null | string>(null);
  const [cameraOpen, setCameraOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [location, setLocation] = useState("")
  const [images, setImages] = useState<MediaPost[]>([
    // {
    //   url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    //   comment: "These is very adorable. I am loving this. Sometimes this pictures just are beautiful!",
    //   created_at: "2022-08-09 00:41:58",
    //   created_by: "Arman Khasikyan",
    //   location: [51.507358, -0.127642]
    // },
    // {
    //   url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    //   comment: "These is very adorable. I am loving this. Sometimes this pictures just are beautiful!",
    //   created_at: "2022-08-09 00:41:58",
    //   created_by: "Arman Khasikyan",
    //   location: [51.507358, -0.127642]
    // },
    // {
    //   url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    //   comment: "These is very adorable. I am loving this. Sometimes this pictures just are beautiful!",
    //   created_at: "2022-08-09 00:41:58",
    //   created_by: "Arman Khasikyan",
    //   location: [51.507358, -0.127642]
    // },
    // {
    //   url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    //   comment: "These is very adorable. I am loving this. Sometimes this pictures just are beautiful!",
    //   created_at: "2022-08-09 00:41:58",
    //   created_by: "Arman Khasikyan",
    //   location: [51.507358, -0.127642]
    // },
    // {
    //   url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    //   comment: "These is very adorable. I am loving this. Sometimes this pictures just are beautiful!",
    //   created_at: "2022-08-09 00:41:58",
    //   created_by: "Arman Khasikyan",
    //   location: [51.507358, -0.127642]
    // },
  ])

  useEffect(() => {
    function resToState(res: MediasResponse[]) {
      res.map((post) => {
        setImages(images => {
          const newPost: MediaPost = {
            url: post.content?.original_url || '',
            comment: post.comment || '',
            created_at: post.created_at,
            created_by: post.created_by.name,
            location: [ Number(post.cluster.latitude), Number(post.cluster.longitude)]
          }
          return [...images, newPost]
        })
      })
    }
    if (process.env.NODE_ENV === 'development') {
      resToState(uploads_get.data)
    } else {
      uploadedImages().then((data) => {
        resToState(data.data)
      }).catch((reason: any) => {
        console.log(reason)
      })
    }
    // uploadedImages().then((uploads) => {
    //   uploads.map((upload) => {
    //     const comment = upload.comment
    //     const created_by = upload.created_by.name
    //     const url = upload.media[0].original_url
    //     const created_at = upload.created_at
    //     const cluster = [upload.cluster.latitude, upload.cluster.long]
    //   })
    // })
  }, [])  

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setImgSrc(images[index].url)
    geoReverse({
      lat: images[index].location[0],
      lon: images[index].location[1]
    }).then((data) => {
      console.log(data)
      setLocation(data.address.city + ", " + data.address.state + ", " + data.address.country)
    }).catch((reason: any) => {
      console.log(reason)
    })
    console.log(images[index].url)
  };

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
      <Navbar title='Listview' />
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
            <>
              <Box
                component="img"
                alt="image"
                src={imgSrc}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  display: 'block',
                  color: 'white'
                }}
                loading='lazy'
              />
              <div>
                <Typography
                  component={'h4'}
                  variant={'h4'}
                  sx={{
                    display: 'block',
                    mt: 3
                  }}
                >
                  {`By: ${images[selectedIndex].created_by}`}
                </Typography>
                <Typography
                  component={'h4'}
                  variant={'h4'}
                  sx={{
                    display: 'block',
                    mt: 1
                  }}
                >
                  {`At: ${location}`}
                </Typography>
                <Typography
                  component={'h4'}
                  variant={'h4'}
                  sx={{
                    display: 'block',
                    mt: 1
                  }}
                >
                  {`On: ${images[selectedIndex].created_at}`}
                </Typography>
                <Typography
                  component={'p'}
                  variant={'body1'}
                  sx={{
                    display: 'inline-block',
                    mt: 1,
                    color: '#fff'
                  }}
                >
                  {`${images[selectedIndex].comment}`}
                </Typography>
              </div>
            </>
          )}

          {
            !imgSrc && (
              <Typography component={'h2'} variant='h2'>
                No image
              </Typography>
            )
          }



          {/* <ButtonGroup color='secondary' aria-label="medium secondary button group" sx={{
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
            </Button>
          </ButtonGroup> */}
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
        <Grid item xs={12} md={6} component={Paper} square sx={{
          // display: 'flex',
          // justifyContent: "center",
          alignItems: 'center',
        }}>
          <Box
            sx={{ width: '100%', bgcolor: 'background.paper' }}
          >
            <Virtuoso
              style={{ height: "100vh", width: "100%"}}
              totalCount={images.length}
              itemContent={(index) => (
                <ListItem key={index} component="div">
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <img
                      src={`${images[index].url}?w=${imageSize}&h=${imageSize}&fit=crop&auto=format`}
                      srcSet={`${images[index].url}?w=${imageSize}&h=${imageSize}&fit=crop&auto=format&dpr=2 2x`}
                      alt={`${index}`}
                      loading="lazy"
                    />
                    <Box
                      component={'div'}
                      sx={{
                        display: 'block',
                        flex: '1 1 auto',
                        minWidth: 0,
                      }}
                    >
                      <ListItemText
                        primary={`${images[index].created_by}`}
                        primaryTypographyProps={{
                          fontSize: 20,
                          fontWeight: 'medium',
                          letterSpacing: 0,
                          paddingLeft: '1rem',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                        secondary={`${images[index].comment}`}
                        secondaryTypographyProps={{
                          fontSize: 15,
                          fontWeight: 'medium',
                          letterSpacing: 0,
                          paddingTop: '0.3rem',
                          paddingLeft: '1rem',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          // lineHeight: 3,
                        }}
                      />
                      <div style={{
                        paddingLeft: '1rem',
                        paddingTop: '1rem',
                        display: 'flex',
                        // justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <WatchLaterIcon fontSize='small' />
                        <Typography
                          component={'p'}
                          variant={'subtitle1'}
                          sx={{
                            display: 'inline-block',
                            fontSize: '0.9rem',
                            ml: 1
                          }}
                        >
                          {`${images[index].created_at}`}
                        </Typography>
                      </div>
                    </Box>
                  </ListItemButton>
                </ListItem>
                // <div style={{
                //   color: 'black'
                // }}>Item {index}
                // </div>
              )
                }
            />
             {/* <FixedSizeList
              height={400}
              width={360}
              itemSize={46}
              itemCount={200}
              overscanCount={5}
            >
              {renderRow}
            </FixedSizeList> */}
          </Box>
          {/* <Box component="form" noValidate onSubmit={handleSubmit} sx={{
            py: 8,
            px: 1,
            // display: 'flex',
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: 'center',
            position: "relative",
            width: "80%"
          }}>
          </Box> */}
        </Grid>
        <CameraDlg
          open={cameraOpen}
          onClose={handleCameraClose}
        />
      </Grid>
    </>
  );
};

function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}


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