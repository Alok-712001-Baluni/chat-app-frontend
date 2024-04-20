import { IMessage, IUser } from "context/ChatProvider";

export const getSender = (
    loggedUser: IUser | null,
    users: IUser[] | null
) => {
    if (users) {
        return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name
    };
    return null;
};

export const getSenderFull = (loggedUser: IUser | null, users: IUser[] | null) => {
    if (users && loggedUser) {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    }
    return null;
};

export const isSameSender = (
    messages: IMessage[],
    currentMessage: IMessage,
    currentMessageIndex: number,
    loggedUserId: string
) => {
    return (
        currentMessageIndex < messages.length - 1 &&
        (messages[currentMessageIndex + 1].sender._id !==
            currentMessage.sender._id ||
            messages[currentMessageIndex + 1].sender._id === undefined) &&
        messages[currentMessageIndex].sender._id !== loggedUserId
    );
};

export const isLastMessage = (
    messages: IMessage[],
    currentMessageIndex: number,
    loggedUserId: string
) => {
    return (
        currentMessageIndex === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== loggedUserId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameSenderMargin = (
    messages: IMessage[],
    currentMessage: IMessage,
    currentMessageIndex: number,
    loggedUserId: string
) => {
    if (
        currentMessageIndex < messages.length - 1 &&
        messages[currentMessageIndex + 1].sender._id ===
        currentMessage.sender._id &&
        messages[currentMessageIndex].sender._id !== loggedUserId
    )
        return 33;
    else if (
        (currentMessageIndex < messages.length - 1 &&
            messages[currentMessageIndex + 1].sender._id !==
            currentMessage.sender._id &&
            messages[currentMessageIndex].sender._id !== loggedUserId) ||
        (currentMessageIndex === messages.length - 1 &&
            messages[currentMessageIndex].sender._id !== loggedUserId)
    )
        return 0;
    else return "auto";
};

export const isSameUser = (
    messages: IMessage[],
    currentMessage: IMessage,
    currentMessageIndex: number
) => {
    return (
        currentMessageIndex > 0 &&
        messages[currentMessageIndex - 1].sender._id === currentMessage.sender._id
    );
};
