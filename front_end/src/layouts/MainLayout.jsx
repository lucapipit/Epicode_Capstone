import React from 'react'
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'

const MainLayout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      {children}
      <Footer />
    </>
  )
}

export default MainLayout