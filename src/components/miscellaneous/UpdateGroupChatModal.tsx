import { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { ChatState, IUser } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { chatRename, groupAdd, groupRemove, searchChat, groupLeave } from "query/chat";

type AppProps = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  fetchMessages: () => {};
}
const UpdateGroupChatModal: React.FC<AppProps> = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleRemove = async (removeUser: IUser | null) => {
    // Check if group admin id !== logged in user id and user id who is trying to remove !== logged in user id
    if (
      selectedChat?.groupAdmin?._id !== user?._id &&
      removeUser?._id !== user?._id
    ) {
      return toast({
        title: "Only admins can remove someone!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }

    try {
      setLoading(true);

      const data = await groupRemove("/api/chat/groupremove", {
        chatId: selectedChat?._id,
        userId: removeUser?._id,
      });

      // If logged in user removed himself or left the group
      removeUser?._id === user?._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain); // Fetching all the chat again
      fetchMessages(); // All the messages will be refreshed
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return toast({
        title: "Error Occured!",
        description: "Failed to remove the user!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }
  };

  const handleLeave = async (removeUser: IUser | null) => {

    try {
      setLoading(true);

      const data = await groupLeave("/api/chat/groupLeave", {
        chatId: selectedChat?._id,
        userId: removeUser?._id,
      });

      // If logged in user removed himself or left the group
      removeUser?._id === user?._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain); // Fetching all the chat again
      fetchMessages(); // All the messages will be refreshed
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return toast({
        title: "Error Occured!",
        description: "Failed to remove the user!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }
  };

  const handleAddUser = async (addUser: IUser) => {
    // If the user already in the group
    if (selectedChat?.users.find((u: IUser) => u._id === addUser._id)) {
      return toast({
        title: "User Already in group!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }

    // Check if the user admin or not
    if (selectedChat?.groupAdmin._id !== user?._id) {
      return toast({
        title: "Only admins can add someone!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }

    try {
      setLoading(true);

      const data = await groupAdd("/api/chat/groupadd", {
        chatId: selectedChat?._id,
        userId: addUser._id,
      })

      setSelectedChat(data);
      setFetchAgain(!fetchAgain); // Fetching all the chat again
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return toast({
        title: "Error Occured!",
        description: "Failed to add the user!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);

      const data = await chatRename("/api/chat/rename", {
        chatId: selectedChat?._id,
        chatName: groupChatName,
      })

      setSelectedChat(data);
      setFetchAgain(!fetchAgain); // Fetching all the chat again
      setRenameLoading(false);
    } catch (error) {
      setRenameLoading(false);
      return toast({
        title: "Error Occured!",
        description: "Failed to rename group chat!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }

    setGroupChatName("");
  };

  const handleSearch = async (query: string) => {
    setSearch(query);

    if (!query || query === "") {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);

      const data = await searchChat(`/api/user?search=${search}`)

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      return toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
        variant: "solid",
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="view button"
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="35px"
            fontFamily="Work sans"
          >
            {selectedChat?.chatName}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb="3">
              {selectedChat?.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb="3"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb="1"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResults?.map((user: IUser) => (
                <UserListItem
                  key={user?._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleLeave(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
