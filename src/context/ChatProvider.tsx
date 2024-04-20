import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

type AppProps = {
    children: React.ReactNode;
}

export interface IUser {
    _id: string,
    name: string,
    email: string,
    pic: string,
    token: string,
}

export interface ISelectedChat {
    _id: string,
    chatName: string,
    isGroupChat: boolean,
    users: IUser[],
    latestMessage: {
        name: string,
        pic: string,
        email: string
    },
    groupAdmin: IUser,
}

export interface IMessage {
    sender: {
        _id: string;
        name: string;
        pic: string;
    },
    content: string;
    chats: ISelectedChat[]
}

type ChatContextType = {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<null | IUser>>;
    selectedChat: null | ISelectedChat;
    setSelectedChat: React.Dispatch<React.SetStateAction<null | ISelectedChat>>;
    chats: ISelectedChat[],
    setChats: React.Dispatch<React.SetStateAction<ISelectedChat[]>>;
    notification: any[],
    setNotification: React.Dispatch<React.SetStateAction<any[]>>;

};

const ChatContext = createContext<ChatContextType>({
    user: null,
    setUser: () => { },
    selectedChat: null,
    setSelectedChat: () => { },
    chats: [],
    setChats: () => { },
    notification: [],
    setNotification: () => { }
});

const ChatProvider: React.FC<AppProps> = ({ children }) => {
    const [user, setUser] = useState<null | IUser>(null); // If 'userInfo' is available, else set '{}'
    const [selectedChat, setSelectedChat] = useState<null | ISelectedChat>(null);
    const [chats, setChats] = useState<ISelectedChat[]>([]);
    const [notification, setNotification] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
        setUser(userInfo);

        if (!userInfo) {
            navigate("/");
        }
        // eslint-disable-next-line
    }, [navigate]);

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                notification,
                setNotification,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
