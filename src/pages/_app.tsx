import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {defineStyle, defineStyleConfig, extendTheme} from "@chakra-ui/react";
import {ChakraProvider} from "@chakra-ui/provider";
import Layout from "@/components/Layout";

export const homeBackground = defineStyle({
    backgroundColor: '#8FA3EC',
    opacity: 0.8,
    background: 'radial-gradient(circle, transparent 20%, #8FA3EC 20%, #8FA3EC 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #8FA3EC 20%, #8FA3EC 80%, transparent 80%, transparent) 25px 25px, linear-gradient(#7282BD 2px, transparent 2px) 0 -1px, linear-gradient(90deg, #7282BD 2px, #8FA3EC 2px) -1px 0',
    backgroundSize: '50px 50px, 50px 50px, 25px 25px, 25px 25px'
})

export default function App({ Component, pageProps }: AppProps) {

  const theme = extendTheme({
      components: {
          Text: {
              baseStyle: {
                  color: '#ffffff'
              }
          },
      },
      styles: {
      global: () => ({
          body: {

              },
          input: {
              color: '#ffffff',
              textAlign: 'center',
          },
          'main, main > div': {
              height: '100vh'
          }
      }),
    },
      colors: {
          brand: {
              100: "",
              // ...
              900: "#41518b",
          },
      },
  },);

  return (
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
  )
}
