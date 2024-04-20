import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { IUser } from "context/ChatProvider";
import { searchUser } from "query/user";
import { createGroup } from "query/chat";

type AppProps = {
  children: React.ReactNode;
}

const GroupChatModal: React.FC<AppProps> = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { chats, setChats } = ChatState();

  const handleSearch = async (query: string) => {
    setSearch(query);

    if (!query || query === "") {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);

      const data = await searchUser(`/api/user?search=${search}`)

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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      return toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
        variant: "solid",
      });
    }

    try {
      const data = await createGroup("/api/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((user: IUser) => user?._id))
      })

      setChats([data, ...chats]);
      onClose(); // Close the modal

      return toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    } catch (error) {
      return toast({
        title: "Error Occured!",
        description: "Failed to create the chat!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }
  };

  const handleDelete = (deletedUser: IUser) => {
    setSelectedUsers(
      selectedUsers.filter((selected: IUser) => selected._id !== deletedUser._id)
    );
  };

  const handleGroup = (userToAdd: IUser) => {
    if (selectedUsers.includes(userToAdd)) {
      return toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="35px"
            fontFamily="Work sans"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Rohit, Piyush, Aman"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* Selected users */}
            <Box display="flex" flexWrap="wrap" w="100%">
              {selectedUsers.map((user: IUser) => (
                <UserBadgeItem
                  key={user?._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {loading ? (
              <div>Loading</div>
            ) : (
              searchResults?.map((user: IUser) => (
                <UserListItem
                  key={user?._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
