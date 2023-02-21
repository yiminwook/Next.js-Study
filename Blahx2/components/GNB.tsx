import { Avatar, Box, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth.user.context';

const GNB = function () {
  const { loading, authUser, signInWithGoogle, signOut } = useAuth();

  const authIntialized = loading || authUser === null;

  const logInBtn = (
    <Button
      onClick={signInWithGoogle}
      fontSize="sm"
      fontWeight={600}
      color="white"
      bg="pink.400"
      _hover={{ bg: 'pink.300' }}
    >
      로그인
    </Button>
  );

  const userMenu = (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<Avatar size="md" src={authUser?.photoURL ?? '/user.png'} />}
        borderRadius="full"
      />
      <MenuList>
        <MenuItem
          onClick={() => {
            window.location.href = `/${authUser?.email?.replace('@gmail.com', '')}`;
          }}
        >
          사용자 홈으로 이동
        </MenuItem>
        <MenuItem onClick={() => signOut()}>로그아웃</MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Box borderBottom={1} borderStyle="solid" borderColor="gray.200" bgColor="white">
      <Flex minH="60px" px={{ base: 4 }} py={{ base: 2 }} align="center" maxW="md" mx="auto">
        <Spacer />
        <Box flex="1">
          <img style={{ height: '40px' }} src="/logo.svg" alt="GNB 로고" />
        </Box>
        <Box justifyContent="flex-end">{authIntialized ? logInBtn : userMenu}</Box>
      </Flex>
    </Box>
  );
};

export default GNB;
