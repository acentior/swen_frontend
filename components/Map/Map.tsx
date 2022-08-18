
import React, { useEffect, useState } from 'react';
import { icon, LeafletEventHandlerFnMap, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './Map.module.css';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';


import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { useGeolocated } from 'react-geolocated'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { MapPost, MediaPost, MediasResponse } from '../../constants';
import uploads_get from '../../mock/uploads_get.json'
import { Box, Button, Dialog, DialogTitle, Typography } from '@mui/material';
import { geoReverse, uploadedImages } from '../../apis';


dayjs.extend(utc)

// const position : LatLngExpression = [51.505, -0.09]

interface Props {
  className?: string
}

const ICON = icon({
  iconUrl: "/marker.png",
  iconSize: [25, 41]
})

const Map = ({ className }: Props) => {

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
  const [position, setPosition] = useState<LatLngExpression>([51.505, -0.09])
  const [images, setImages] = useState<MapPost[]>([])
  const [imagesOpen, setImagesOpen] = useState(false)
  const [openedPosts, setOpenedPosts] = useState<MapPost>()

  const handleImagesClose = () => {
    setImagesOpen(false)
    setOpenedPosts(undefined)
  }

  const handleImagesOpen = (posts: MapPost) => {
    setImagesOpen(true)
    setOpenedPosts(posts)
  }

  let mapClassName = styles.map;

  if ( className ) {
    mapClassName = `${mapClassName} ${className}`;
  }

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      permissionStatus.onchange = () => {
        getPosition()
        console.log(coords)
        if (coords) {
          setPosition([coords.latitude, coords.longitude])
        }
      }
    });

    function resToState(res: MediasResponse[]) {
      console.log(res.length)
      res.map((post) => {
        let exist = false
        setImages((images) => {
          images.map((mpost) => {
            if (mpost.location[0].toString() === post.cluster.latitude && mpost.location[1].toString() === post.cluster.longitude) {
              mpost.posts = [...mpost.posts, {
                url: post.content?.original_url || '',
                comment: post.comment || '',
                created_at: post.created_at,
                created_by: post.created_by.name
              }]
              console.log("mpost.posts")
              console.log(mpost.posts)
              exist = true
            }
            console.log("mpost")
            console.log(mpost)
            return mpost
          })
          // console.log(images)
          if (exist) {
            return images
          } else {
            return [...images, {
              location: [Number(post.cluster.latitude), Number(post.cluster.longitude)],
              posts: [{
                url: post.content?.original_url || '',
                comment: post.comment || '',
                created_at: post.created_at,
                created_by: post.created_by.name
              }]
            }]
          }
        })
      })
    }
    if (process.env.NODE_ENV === 'development') {
      console.log("res to state")
      resToState(uploads_get.data)
      setImages((images) => {
        console.log("images state")
        console.log(images)
        return images
      })
    } else {
      uploadedImages().then((data) => {
        resToState(data.data)
      }).catch((reason: any) => {
        console.log(reason)
      })
    }

    return () => {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        permissionStatus.onchange = null
      });
    }
  }, [])

  const onClickHandler = (info: string) => (ev: LeafletMouseEvent) => {
    alert(info)
  }

  const blueOptions = {
    color: 'blue',
    fillColor: 'blue'
  }
  const blackOptions = {
    color: 'black',
    fillColor: 'black'
  }
  const limeOptions = {
    color: 'lime',
    fillColor: 'lime'
  }
  const purpleOptions = {
    color: 'purple',
    fillColor: 'purple'
  }
  const redOptions = {
    color: 'red',
    fillColor: 'red'
  }

  return (
    <>
      <MapContainer className={mapClassName} center={position} zoom={15} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {images.map((image, idx) => (
          <Circle key={idx} center={image.location} pathOptions={redOptions} radius={100} eventHandlers={{
            click: (ev: LeafletMouseEvent) => {
              handleImagesOpen(images[idx])
            }
          }} />
        ))}
        <Marker
          position={position}
          icon={ICON}
        >
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <ImagesDlg
        open={imagesOpen}
        onClose={handleImagesClose}
        posts={openedPosts}
      />
    </>
  )
}

interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  posts: MapPost | undefined;
}

const ImagesDlg = (props: SimpleDialogProps) => {
  const { onClose, open, posts } = props;

  const handleClose = () => {
    onClose("");
  };

  const [location, setLocation] = useState("")

  useEffect(() => {
    if (posts) {
      geoReverse({
        lat: posts.location[0],
        lon: posts.location[1]
      }).then((data) => {
        console.log(data)
        setLocation(data.display_name)
        // setLocation(data.address.city + ", " + data.address.state + ", " + data.address.country)
      }).catch((reason: any) => {
        console.log(reason)
      })
    }
  }, [posts])

  return (
    <Dialog onClose={handleClose} open={open}
      sx={{
        maxWidth: "90vw"
      }}
    >
      <DialogTitle
        color='primary'
        variant='h3'
        component='h3'
      >
          Posts
      </DialogTitle>
      <Typography
        component={'h4'}
        variant={'h4'}
        sx={{
          display: 'block',
          mt: 1
        }}
        color='primary'
      >
        {`At: ${location}`}
      </Typography>
      {posts?.posts.map((post, idx) => (
        <div key={idx} style={{
          margin: "1rem 1rem 0rem 1rem"
        }}>
          <Box
            component="img"
            alt="image"
            src={post.url}
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
              color='primary'
            >
              {`By: ${post.created_by}`}
            </Typography>
            <Typography
              component={'h4'}
              variant={'h4'}
              sx={{
                display: 'block',
                mt: 1
              }}
              color='primary'
            >
              {`On: ${post.created_at}`}
            </Typography>
            <Typography
              component={'p'}
              variant={'body1'}
              sx={{
                display: 'inline-block',
                mt: 1,
              }}
              color='primary'
            >
              {`${post.comment}`}
            </Typography>
          </div>
        </div>
      ))}
    </Dialog>
  );
}

export default Map;