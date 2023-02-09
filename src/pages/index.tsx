import Head from 'next/head'
import {Box, Center, createStandaloneToast, Flex, IconButton, Input, Text} from "@chakra-ui/react";
import {ArrowRightIcon} from "@chakra-ui/icons";
import {motion, Transition} from "framer-motion";
import React, {useEffect, useState} from "react";
import {homeBackground} from "@/pages/_app";
import {useRouter} from "next/navigation";
import {selectName, selectCode, setName, setCode, setBlocks, setId} from "@/redux/blockSlice";
import {useDispatch, useSelector} from "react-redux";
import io from "socket.io-client";

export const socket = io('',{
    path: "/api/socketio",
    reconnection: true,
});

export default function Home() {
    const router = useRouter();
    const { ToastContainer, toast } = createStandaloneToast();
    const dispatch = useDispatch();

    const code: string = useSelector(selectCode);
    const name: string = useSelector(selectName);

    const [isRoomSet, setIsRoomSet] = useState(false);
    const [isNameSet, setIsNameSet] = useState(false);

    const transitionValues: Transition = {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeOut",
        delay: 0.8
    };

    useEffect((): any => {
        if(!socket.connected){
            socket.connect();
        }

        socket.on("connect", () => {
            // log socket connection
            console.log("SOCKET CONNECTED!", socket.id);
        });

        socket.on("joinSuccess", (payload) => {
            setIsRoomSet(true);
            dispatch(setId(payload._id))
            console.log('efwefewf')
        })

        socket.on("joinFailed", () => {
            toast({
                title: 'Invalid Code',
                description: "The room code used is invalid / No such room exists.",
                position: "bottom",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })

        socket.on("nameSetFailed", () => {
            toast({
                title: 'Setting Name Failed',
                description: "Error setting name, please try again.",
                position: "bottom",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
        
        socket.on("nameSetSuccess", (payload) => {
            setIsNameSet(true);
            dispatch(setCode(payload.roomData.code))
            dispatch(setBlocks(payload.roomData.blocks))
            dispatch(setName(payload.name))
            router.push('/room')
        })

        // // update chat on new message dispatched
        // socket.on("message", (message: IMsg) => {
        //     chat.push(message);
        //     setChat([...chat]);
        // });

        // socket disconnect onUnmount if exists
        if (socket) return () => socket.disconnect();
    }, []);

    const handleIconClick = () => {
        if(!isRoomSet){
            if(code.length === 6){
                checkRoom();
            }
        }
        if(!isNameSet && isRoomSet){
            socket.emit("setName", {name,code:code})
        }
    }

    const handleNameChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setName(e.target.value))
    }

    const handleRoomChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setCode(e.target.value))
    }

    const checkRoom = () => {
        socket.emit("joinRoom", {
            code
        })
    }

  return (
    <>
      <Head>
        <title>Squares</title>
        <meta name="description" content="Square Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Box style={homeBackground} >
            <Center h='100%'>
                <Flex flexDirection='column' gap={5} alignItems={'center'}>
                    {!isRoomSet ?
                        <Box>
                            <Text fontSize={['md','2xl']} fontWeight={'semibold'} align='center'>
                                Enter the room code
                            </Text>
                            <br/>
                            <Input value={code} onChange={handleRoomChange} minLength={6} maxLength={6} placeholder={'000000'} size='lg' />
                        </Box>
                        :
                        <Box>
                            <Text fontSize={'2xl'} fontWeight={'semibold'} align='center'>
                                Enter your name
                            </Text>
                            <br/>
                            <Input value={name} onChange={handleNameChange} placeholder={'Name'} size='lg' />
                        </Box>
                    }
                    <motion.div
                        transition={transitionValues}
                        initial={{x: 0}}
                        animate={{x: 5}}
                    >
                        <IconButton onClick={handleIconClick} variant={"unstyled"} color={"white"} aria-label='Next button' icon={<ArrowRightIcon />} />
                    </motion.div>
                </Flex>
            </Center>
        </Box>
        <ToastContainer/>
    </>
  )
}
