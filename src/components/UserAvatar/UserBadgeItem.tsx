import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import { IUser } from "context/ChatProvider";

type AppProps = {
  user: IUser;
  handleFunction: (user: IUser) => void;
}
const UserBadgeItem: React.FC<AppProps> = ({ user, handleFunction }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={(e) => handleFunction(user)}
    >
      {user.name}
      <CloseIcon pl="1" />
    </Badge>
  );
};

export default UserBadgeItem;
