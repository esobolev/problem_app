// import '../styles/globals.css'
// import '../styles/builder.scss'
import '../styles/index.scss'
import '../styles/builder.scss'
import '../styles/new.scss'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
