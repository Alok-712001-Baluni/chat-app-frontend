import { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    useToast,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";

import { ChatState, IMessage } from "../context/ChatProvider";
import { getSender, getSenderFull } from "utils/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import { ISelectedChat } from "context/ChatProvider";
import { getSelectedChat, sendMsg } from "query/chat";

const ENDPOINT = "http://localhost:5000"; // If you are deploying the app, replace the value with "https://YOUR_DEPLOYED_APPLICATION_URL" then run "npm run build" to create a production build

let socket: Socket;
let selectedChatCompare: ISelectedChat | null;

type AppProps = {
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}
const SingleChat: React.FC<AppProps> = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat, notification, setNotification } =
        ChatState();
    const toast = useToast();

    const fetchMessages = async () => {
        // If no chat is selected, don't do anything
        if (!selectedChat) {
            return;
        }

        try {
            setLoading(true);

            const data = await getSelectedChat(`/api/message/${selectedChat['_id']}`)

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat?._id);
        } catch (error) {
            setLoading(false);
            return toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
                variant: "solid",
            });
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));

        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages(); // Whenever users switches chat, call the function again
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat[0]._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain); // Fetch all the chats again
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });

        // eslint-disable-next-line
    });

    const sendMessage = async (e: any) => {
        // Check if 'Enter' key is pressed and we have something inside 'newMessage'
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat?._id);
            try {
                setNewMessage(""); // Clear message field before making API call (won't affect API call as the function is asynchronous)

                const data = await sendMsg("/api/message", {
                    content: newMessage,
                    chatId: selectedChat?._id,
                })

                socket.emit("new message", data);
                setNewMessage("");
                setMessages([...messages, data]); // Add new message with existing messages
            } catch (error) {
                return toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                });
            }
        }
    };

    const typingHandler = (e: any) => {
        setNewMessage(e.target.value);

        // Typing Indicator Logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat?._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat?._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb="3"
                        px="2"
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            aria-label="Icon button"
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat(null)}
                        />
                        {!selectedChat?.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>

                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w="20"
                                h="20"
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    overflowY: "scroll",
                                    scrollbarWidth: "none",
                                }}
                            >
                                <ScrollableChat messages={messages} isTyping={isTyping} />
                            </div>
                        )}

                        <FormControl mt="3" onKeyDown={(e) => sendMessage(e)} isRequired>
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={(e) => typingHandler(e)}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="100%"
                >
                    <Text fontSize="3xl" pb="3" fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
