import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar';
import { Grid, Paper, Box, Typography, ListItem, ListItemButton, ListItemText} from '@mui/material'
import WatchLaterIcon from '@mui/icons-material/WatchLater';

import { Virtuoso } from 'react-virtuoso'
import { geoReverse, uploadedImages } from '../apis';
import { MediaPost, MediasResponse } from '../constants';
import uploads_get from '../mock/uploads_get.json'

const Picture: NextPage = () => {
  const [imgSrc, setImgSrc] = useState<null | string>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [location, setLocation] = useState("")
  const [images, setImages] = useState<MediaPost[]>([])

  useEffect(() => {
    function resToState(res: MediasResponse[]) {
      res.map((post) => {
        setImages(images => {
          const newPost: MediaPost = {
            url: post.content?.original_url || '',
            preview: post.content?.preview_url || '',
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
      setLocation(data.display_name)
    }).catch((reason: any) => {
      console.log(reason)
    })
    console.log(images[index].url)
  };

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
        </Grid>
        <Grid item xs={12} md={6} component={Paper} square sx={{
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
                      src={`${images[index].preview}`}
                      srcSet={`${images[index].preview}`}
                      alt={""}
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
                        }}
                      />
                      <div style={{
                        paddingLeft: '1rem',
                        paddingTop: '1rem',
                        display: 'flex',
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
              )
            }
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Picture