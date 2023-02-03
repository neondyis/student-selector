import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {defineStyle, extendTheme} from "@chakra-ui/react";
import {ChakraProvider} from "@chakra-ui/provider";
import Layout from "@/components/Layout";
import {wrapper} from "@/redux/store";

export const homeBackground = defineStyle({
    backgroundColor: '#8FA3EC',
    opacity: 0.8,
    background: 'radial-gradient(circle, transparent 20%, #8FA3EC 20%, #8FA3EC 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #8FA3EC 20%, #8FA3EC 80%, transparent 80%, transparent) 25px 25px, linear-gradient(#7282BD 2px, transparent 2px) 0 -1px, linear-gradient(90deg, #7282BD 2px, #8FA3EC 2px) -1px 0',
    backgroundSize: '50px 50px, 50px 50px, 25px 25px, 25px 25px'
})

export const roomBackGround = defineStyle({
    backgroundColor: '#8FA3EC',
    opacity: 0.8,
    backgroundImage: 'radial-gradient(#E5E5F7 1.05px, transparent 1.05px), radial-gradient(#444cf7 1.05px, #8FA3EC 1.05px)',
    backgroundPosition: '0 0,21px 21px',
    backgroundSize: '42px 42px'
});

function App({ Component, pageProps }: AppProps) {

  const theme = extendTheme({
      components: {
          Text: {
              baseStyle: {
                  color: '#ffffff'
              }
          },
          Grid: {
              GridItem: {
                  baseStyle: {
                      width: '100%',
                      height: '10vh',
                      bg: '#41518b',
                      borderRadius: '15px'
                  }
              }
          }
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

export default wrapper.withRedux(App);