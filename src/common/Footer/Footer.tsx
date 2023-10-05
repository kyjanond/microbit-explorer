import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import metadata from '../metadata.json'

export interface IFooterProps {
  visible: boolean
}

const Footer = (props: IFooterProps) => {
  const year = new Date().getFullYear()
  return (
    <Box sx={{ visibility: props.visible ? 'visible' : 'hidden' }} className={'footer-wrapper'}>
      <Typography className={'footer-wrapper__content'} variant="caption" color="inherit">
        {`© ${year} ${metadata.copyright} | ver: ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag} | ${metadata.datetime}`}
      </Typography>
    </Box>
  )
}
export default Footer