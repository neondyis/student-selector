import {Box, Button, createStandaloneToast, Flex, Grid, GridItem, Text} from "@chakra-ui/react";
import {roomBackGround} from "@/pages/_app";
import {useDispatch, useSelector} from "react-redux";
import {selectBlocks, selectName, selectCode, setBlocks, selectId} from "@/redux/blockSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "..";

export default function Room() {
    const { ToastContainer, toast } = createStandaloneToast();
    const dispatch = useDispatch();
    const router = useRouter();
    const code: string = useSelector(selectCode);
    const name = useSelector(selectName);
    const blocks = useSelector(selectBlocks);
    const id = useSelector(selectId);
    const [currentTurn, setCurrentTurn] = useState('');
    const [isRevealButtonClicked, setRevealButtonClicked] = useState(false);

    useEffect(()=>
    {
        if(name === '' || code === ''){
            router.push('/')
        }else{
            if(!socket.connected){
                socket.connect();
                socket.emit('joinRoom',{code})
                socket.emit('getCurrentTurn', {code})
            }else{
                socket.emit('joinRoom',{code})
                socket.emit('getCurrentTurn', {code})
            }
        }

        socket.on('InitiateCurrentTurn', (payload:any) => {
            setCurrentTurn(payload.currentTurn);
        })

        socket.on('setCurrentTurn', (payload:any) => {
            setCurrentTurn(payload.currentTurn);
        })

        socket.on('BlockRevealSuccess', (payload:any) =>{
            dispatch(setBlocks(payload.blocks));
            console.log(payload)
        })

        socket.on('BlockRevealFailed', (payload:any) =>{
            toast({
                title: 'Failed to Reveal.',
                description: payload,
                position: "bottom",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    },[]);

    const revealBlock = () => {
        socket.emit('revealBlock', {id,code,name})
        setRevealButtonClicked(true);
    }
    

    return (
        <Box style={roomBackGround} overflow={"auto"}>
            <Flex flexDirection={'column'} gap={15}>
                <Flex flexDirection={'row'} justifyContent={'space-around'} >
                    <Text fontWeight={'bold'}>
                        Room #{code}
                    </Text>
                    {currentTurn === name &&  <Button isDisabled={isRevealButtonClicked} onClick={revealBlock}>Reveal Block</Button>}
                    {currentTurn !== '' && <Text> {currentTurn} turn</Text>}
                    
                </Flex>
                    <Grid
                        h='100%'
                        templateRows='repeat(6, 1fr)'
                        templateColumns='repeat(4, 1fr)'
                        margin={'0 5vw 0 5vw'}
                        justifyItems={"center"}
                        gap={2}
                    >
                        {blocks.map((data, index) => {
                            return (
                                <GridItem  key={index} minW='75px' w={'100%'} h='12vh' bg='#41518b' borderRadius={'10px'} border={'2px solid #3F3DA1'}>
                                    {!data.isShown ?
                                        <></>
                                        :
                                        <Flex flexDirection={"column"} alignItems={"center"} justifyContent={"center"} height={'100%'}>
                                            <Text>
                                                {data.info}
                                            </Text>
                                            <Text>
                                                {data.user}
                                            </Text>
                                        </Flex>
                                    }
                                </GridItem>
                            )
                        })}
                    </Grid>
            </Flex>
            <ToastContainer/>
        </Box>
    )
}