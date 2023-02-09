import {homeBackground} from "@/pages/_app";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center, Text,
    Flex,
    FormLabel, IconButton,
    Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Tag, useDisclosure, Editable, EditablePreview, EditableInput, ButtonGroup, useEditableControls,
    createStandaloneToast,
    TagLabel
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from 'axios';
import {Block} from '../../lib/models/RoomModel'
import {ArrowLeftIcon, CheckIcon, CloseIcon, EditIcon} from "@chakra-ui/icons";
import { socket } from "..";


export default function Admin() {
    const password = 'Aylinka'
    const { ToastContainer, toast } = createStandaloneToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [showOptions, setShowOptions] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showRooms, setShowRooms] = useState(false);
    const [listInput, setListInput] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [listValues, setListValues] = useState<Block[]>([]);
    const [roomList, setRoomList] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState<any>();
    const [currentTurn, setCurrentTurn] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const handleCreateOnClick = () => {
        setShowOptions(true);
        setShowCreate(true);
    }

    const handleManageOnClick = () => {
        setShowOptions(true);
        setShowRooms(true);
    }

    const addToListValues = () => {
        if (listInput !== '') {
            if(!listValues.some(e => e.info === listInput)){
                setListValues([...listValues, {info: listInput, user: ''}]);
                setListInput('');
            }else{
                toast({
                    title: 'Failed to add to List.',
                    description: "Value already exist.",
                    position: "bottom",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
            }
        }
    }

    const saveRoom = () => {
        axios.post('/api/rooms', {code: roomCode, blocks: listValues, users: []}).then(() => {
            toast({
                title: 'Saving Succeeded',
                description: "The room has been created and can be access with the room code.",
                position: "bottom",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            setSelectedRoom({...selectedRoom, code: roomCode})
        })
    }

    const openRoomModal = (room:any) => {
        setSelectedRoom(room);
        setRoomCode(room.code)
        socket.emit('joinRoom',{code: room.code})
        socket.emit('getCurrentTurn', {code: room.code})
        onOpen();
    }

    const updateRoomList = (id:string, info:string) => {
        axios.put('/api/rooms', {blockId: id, info:info}).then(() => {
            toast({
                title: 'Update Succeeded',
                description: "The room list item has been updated.",
                position: "bottom",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
        ).catch(() => {
            toast({
                title: 'Update Failed',
                description: "The room list item has not been updated.",
                position: "bottom",
                status: 'error',
                duration: 2000,
                isClosable: true,
            }) 
        })
    }

    const updateRoomCode = () => {
        axios.put('/api/rooms', {roomId: selectedRoom._id, code:roomCode}).then(() => {
            toast({
                title: 'Update Succeeded',
                description: "The room code has been updated.",
                position: "bottom",
                status: 'success',
                duration: 2000,
                isClosable: true,
            }) 
        }  
        ).catch(() => {
            toast({
                title: 'Update Failed',
                description: "The room code has not been updated.",
                position: "bottom",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    const startSelection = () => {
        socket.emit('startSelection', {code: roomCode , admin:true})
    }

    useEffect(() => {
        if(!socket.connected){
            socket.connect();
            socket.emit('joinRoom',{code: roomCode})
            socket.emit('getCurrentTurn', {code: roomCode})
        }

        socket.on('InitiateCurrentTurn', (payload:any) => {
            setCurrentTurn(payload.currentTurn);
            console.log(payload)
        })

        socket.on('startFailed', () => {
            toast({
                title: 'Failed to Select.',
                description: "Failed to select player, most likely due to no players to select from.",
                position: "bottom",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })

        socket.on('setCurrentTurn', (payload:any) => {
            setCurrentTurn(payload.currentTurn);
        })

        socket.on('BlockRevealSuccess', (payload:any) =>{
            setSelectedRoom({...selectedRoom,blocks:payload.blocks})
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

        axios.get('/api/rooms')
            .then(res => {
                setRoomList(res.data.rooms)
            })
    }, [])

    function EditableControls() {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls()

        return isEditing ? (
            <ButtonGroup justifyContent='center' size='sm'>
                <IconButton aria-label={'Confirm'} icon={<CheckIcon />} {...getSubmitButtonProps()} />
                <IconButton aria-label={'Cancel'} icon={<CloseIcon />} {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent='center'>
                <IconButton aria-label={'Edit'} size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
            </Flex>
        )
    }

    return (
        <Box style={homeBackground} overflow={"auto"}>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={'center'}>Managing Room</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedRoom &&
                        <Box>
                            <Flex flexDirection={"column"} gap={1}>
                                <Text variant={'admin'}>Current Selected Student : {currentTurn}</Text>
                            <Button onClick={startSelection}>Start Student Selection</Button>
                            </Flex>
                            <br/>
                            {/*// @ts-ignore*/}
                            <FormLabel textAlign={"center"}>
                                Room Code
                            </FormLabel>
                            <Input placeholder={selectedRoom!.code} value={roomCode} onChange={e => setRoomCode(e.target.value)} maxLength={6} minLength={6} variant='admin' marginBottom={'10px'}></Input>
                            <Flex flexDirection={'row'} justifyContent={"space-evenly"} flexWrap={"wrap"} gap={1}>
                                {/*// @ts-ignore*/}
                                {selectedRoom!.blocks.map((block,index) => {
                                    return (
                                            <Tag key={index} minW={'80px'} flexDirection={"column"} justifyContent={'center'} alignContent={"center"}>
                                                <TagLabel>{block.user ? block.user : 'No User'}</TagLabel>
                                                    <Editable
                                                        textAlign='center'
                                                        defaultValue={`${block.info}`}
                                                        fontSize='sm'
                                                        isPreviewFocusable={false}
                                                        onEdit={() => {console.log(index)}}
                                                        onSubmit={(e) => {updateRoomList(block._id,e)}}
                                                    >
                                                        <EditablePreview />
                                                        {/* Here is the custom input */}
                                                        <Input as={EditableInput} variant={'admin'} maxW={'100px'}/>
                                                        <EditableControls />
                                                       </Editable>
                                            </Tag>
                                    )
                                })}
                            </Flex>
                        </Box>
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme='purple' onClick={updateRoomCode}>Modify Room Code</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {passwordInput === password ? 
            <Center h={'100%'}>
            {!showOptions &&
                <Flex flexDirection={'column'} gap={2}>
                    <Button onClick={handleCreateOnClick} minW={'160px'}>
                        Create a Room
                    </Button>
                    <Button onClick={handleManageOnClick} minW={'160px'}>
                        Manage Rooms
                    </Button>
                </Flex>
            }

            {showCreate &&
                <Box>
                    <Card width={'50vw'}>
                        <CardHeader>
                            <Flex flexDirection={"row"} alignItems={"center"}>
                                <IconButton aria-label={'Back button'} icon={<ArrowLeftIcon/>} onClick={() => {setShowCreate(false); setShowOptions(false)}}/>
                                <Text variant={'admin'} >Creating a Room</Text>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            <Flex gap={2} flexDirection={'column'}>
                                <FormLabel>Room Code</FormLabel>
                                <Input type='text' value={roomCode} onChange={e => setRoomCode(e.target.value)}
                                       variant='admin' maxLength={6}/>
                                <FormLabel>List Values - {listValues.length}</FormLabel>
                                <Input type='text' value={listInput} onChange={e => setListInput(e.target.value)}
                                       variant='admin'/>
                                <Flex flexDirection={'row'} gap={2} flexWrap={'wrap'} maxH={'125px'}
                                      overflow={'auto'}>
                                    {listValues.map((listValue, index) => {
                                        return (
                                            <Tag key={index} size={'sm'} colorScheme='cyan'>{listValue.info}</Tag>)
                                    })}
                                </Flex>
                                <Button onClick={addToListValues}>Add to List</Button>
                            </Flex>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={saveRoom}>Save Room</Button>
                        </CardFooter>
                    </Card>
                </Box>
            }

            {showRooms &&
                <Box>
                    <Card width={'50vw'}>
                        <CardHeader>
                            <Flex flexDirection={"row"}>
                                <IconButton aria-label={'Back button'} icon={<ArrowLeftIcon/>} onClick={() => {setShowRooms(false); setShowOptions(false)}}/>
                                <Text> List of Rooms </Text>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            <Flex gap={2} flexDirection={'column'}>
                                {roomList &&
                                    roomList.map((room, index) => {
                                        return (
                                            <Flex key={index} flexDirection={'row'}>
                                                <Tag onClick={() => openRoomModal(room)}>
                                                    {room['code']}
                                                </Tag>
                                            </Flex>
                                        )
                                    })
                                }
                            </Flex>
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </Box>
            }
            </Center>
            :
            <Center h={'100%'}>
                <Card>
                    <CardHeader>
                        <Text color='black'> Input Admin Password </Text>
                    </CardHeader>
                    <CardBody>
                        <Input onChange={e => setPasswordInput(e.target.value)} value={passwordInput} type="password"/>
                    </CardBody>
                </Card>
            </Center>
        }
            
            <ToastContainer/>
        </Box>
    )
}