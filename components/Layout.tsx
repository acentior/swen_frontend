// import React, {useRef, useEffect, useState} from 'react'
import React, {useEffect, useRef, useState} from 'react'
import Navbar from './Navbar'

interface Props {
  title: string,
  children: React.ReactNode
}


const Layout = ({ title, children }: Props) => {
  // const [windowH, setWindowH] = React.useState(0)
  // const navbar: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement | null>(null)
  // useEffect(() => {
  //   console.log(navbar.current?.clientHeight)
  //   let navbarH = 0
  //   if (navbar.current?.clientHeight) {
  //     navbarH = navbar.current?.clientHeight
  //   }
  //   setWindowH(window.innerHeight - navbarH)
  //   return () => {
  //   }
  // }, [navbar])

  // const childrenWithProps = React.Children.map(children, child => {
  //   // Checking isValidElement is the safe way and avoids a typescript
  //   // error too.
  //   if (React.isValidElement(child)) {
  //     console.log(windowH)
  //     return React.cloneElement(child, { windowheight: windowH });
  //   }
  //   return child;
  // });

  return (
    <>
      {/* <div ref={navbar}>
      </div> */}
      <Navbar title={title} />
      {children}
      {/* {
        React.Children.map(children, child => {
          // Checking isValidElement is the safe way and avoids a typescript
          // error too.
          if (React.isValidElement(child)) {
            console.log(windowH)
            return React.cloneElement(child, { windowheight: windowH });
          }
          return child;
        })
      } */}
      {/* {childrenWithProps} */}
    </>
  )
}

export default Layout