import Head from 'next/head'
import { Inter } from '@next/font/google'
import {Box, Button, Center, Flex, IconButton, Input, Text} from "@chakra-ui/react";
import {ArrowRightIcon} from "@chakra-ui/icons";
import {motion, Transition} from "framer-motion";
import React, {useState} from "react";
import {homeBackground} from "@/pages/_app";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [room,setRoom] = useState('');
    const [name,setName] = useState('');
    const [isRoomSet, setIsRoomSet] = useState(false);
    const [isNameSet, setIsNameSet] = useState(false);
    const transitionValues: Transition = {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeOut",
        delay: 0.8
    };

    const handleIconClick = () => {
        if(!isRoomSet){
            if(room.length === 6){
                setIsRoomSet(true);
            }
        }
        if(!isNameSet){

        }
    }

    const handleNameChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleRoomChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
       setRoom(e.target.value);
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
                            <Input value={room} onChange={handleRoomChange} maxLength={6} fontSize={'4xl'} placeholder={'000000'} w={'50vw'} h={'75px'} border={0} size={"lg"} bgColor='brand.900' boxShadow='0px 4px 4px 1px rgba(0, 0, 0, 0.25)'/>
                        </Box>
                        :
                        <Box>
                            <Text fontSize={'2xl'} fontWeight={'semibold'} align='center'>
                                Enter your name
                            </Text>
                            <br/>
                            <Input value={name} onChange={handleNameChange} fontSize={'4xl'} placeholder={'Name'} w={'50vw'} h={'75px'} border={0} size={"lg"} bgColor='brand.900' boxShadow='0px 4px 4px 1px rgba(0, 0, 0, 0.25)'/>
                        </Box>
                    }
                    <motion.div
                        transition={transitionValues}
                        initial={{x: 0}}
                        animate={{x: 5}}
                    >
                        <IconButton variant={"unstyled"} color={"white"} aria-label='Next button' icon={<ArrowRightIcon />} />
                    </motion.div>
                </Flex>
            </Center>
        </Box>
    </>
  )
}
