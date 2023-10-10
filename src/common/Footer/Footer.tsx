/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import metadata from '../../metadata.json'
import './footer.scss'
import {Typography } from '@mui/material'

export interface IFooterProps {
  visible: boolean
}

const Footer = (props: IFooterProps) => {
  const year = new Date().getFullYear()
  return (
    <span className={`footer ${props.visible?'':'footer--hidden'}`}>
      <Typography className={'footer-content'} variant="caption" color="inherit">
        {`© ${year} ${metadata.copyright} | `}
        <a href='https://opensource.org/license/mit/'>MIT License</a>
        {` | ver: ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`}
      </Typography>
      <span className='footer-content-hidden'>
        {`${metadata.datetime}`}
      </span>
    </span>
  )
}
export default Footer