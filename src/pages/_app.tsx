import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {defineStyle, defineStyleConfig, extendTheme} from "@chakra-ui/react";
import {ChakraProvider} from "@chakra-ui/provider";
import Layout from "@/components/Layout";
import {wrapper} from "@/redux/store";
import {Provider} from "react-redux";

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

function App({Component, pageProps}: AppProps) {
    // eslint-disable-next-line no-unused-vars
    const { store, props } = wrapper.useWrappedStore(pageProps);

    const Input = defineStyleConfig({
        baseStyle: {
            field: {
                color: '#ffffff',
                border : 0,
                bgColor: 'brand.900!',
                boxShadow:'0px 4px 4px 1px rgba(0, 0, 0, 0.25)',
                w: '100%',
            },
            sizes: {
                lg: {
                    field: {
                        fontSize : '4xl',
                    },
                }
            }
        },
        variants: {
            admin: {
                field: {
                    border: '1px solid',
                    backgroundColor: '#ffffff',
                    // _hover: {
                    //     backgroundColor: 'brand.900',
                    // },
                    color: '#7e89b7',
                }
            }
        },
        defaultProps: {},
    })
    const theme = extendTheme({
        components: {
            Text: {
                baseStyle: {
                    color: '#ffffff'
                },
                variants: {
                    admin: {
                            color: '#000000'
                    }
                },
            },
            // Grid: {
            //     GridItem: {
            //         baseStyle: {
            //             width: '100%',
            //             height: '10vh',
            //             bg: '#41518b',
            //             borderRadius: '15px'
            //         }
            //     }
            // },
            Input
        },
        styles: {
            global: () => ({
                body: {},
                input: {
                    // color: '#ffffff',
                    textAlign: 'center',
                },
                'main, main > div': {
                    height: '100vh'
                }
            }),
        },
        colors: {
            brand: {
                100: "#8fa3ec",
                // ...
                900: "#41518b",
            },
        },
    },);


    return (
        <Provider store={store}>
            <ChakraProvider theme={theme}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </Provider>
    )
}

export default App;