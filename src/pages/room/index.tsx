import {Box, Center, Flex, Grid, GridItem, Text} from "@chakra-ui/react";
import {roomBackGround} from "@/pages/_app";
import {useSelector} from "react-redux";
import {selectName, selectRoom} from "@/redux/blockSlice";

export default function Room() {
    const room: string = useSelector(selectRoom);
    const name = useSelector(selectName);
    const isShown = false;
    const testArray = [
        'Accra','Accra','Accra','Accra',
        'Accra','Accra','Accra','Accra','Accra',
        'Accra','Accra','Accra','Accra','Accra','Accra',
        'Accra','Accra','Accra','Accra','Accra',
        'Accra','Accra','Accra','Accra','Accra',
        'Accra','Accra','Accra']

    return (
        <Box style={roomBackGround} overflow={"auto"}>
            <Flex flexDirection={'column'} gap={15}>
                <Flex flexDirection={'row'} justifyContent={'space-around'} >
                    <Text fontWeight={'bold'}>
                        Room #{room}
                    </Text>
                    <Text >
                        {name}'s turn
                    </Text>
                </Flex>
                    <Grid
                        h='100%'
                        templateRows='repeat(6, 1fr)'
                        templateColumns='repeat(4, 1fr)'
                        margin={'0 5vw 0 5vw'}
                        justifyItems={"center"}
                        gap={2}
                    >
                        {testArray.map((data, index) => {
                            return (
                                <GridItem  key={index} minW='75px' w={'100%'} h='12vh' bg='#41518b' borderRadius={'10px'} border={'2px solid #3F3DA1'}>
                                    {!isShown ?
                                        <></>
                                        :
                                        <Flex flexDirection={"column"} alignItems={"center"} justifyContent={"center"} height={'100%'}>
                                            <Text>
                                                {data}
                                            </Text>
                                            <Text>
                                                {name}
                                            </Text>
                                        </Flex>
                                    }
                                </GridItem>
                            )
                        })}
                    </Grid>
            </Flex>
        </Box>
    )
}

type RoomProps = {

}