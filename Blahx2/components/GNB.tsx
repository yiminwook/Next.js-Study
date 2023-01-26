import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
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

  const logOutBtn = (
    <Button as="a" variant="link" fontWeight={400} onClick={signOut}>
      로그아웃
    </Button>
  );

  return (
    <Box borderBottom={1} borderStyle="solid" borderColor="gray.200" bgColor="white">
      <Flex minH="60px" px={{ base: 4 }} py={{ base: 2 }} align="center" maxW="md" mx="auto">
        <Spacer />
        <Box flex="1">
          <img style={{ height: '40px' }} src="/logo.svg" alt="GNB 로고" />
        </Box>
        <Box justifyContent="flex-end">{authIntialized ? logInBtn : logOutBtn}</Box>
      </Flex>
    </Box>
  );
};

export default GNB;
