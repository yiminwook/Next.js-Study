import { NextPage } from 'next';
import { Box, Heading, Flex, Center } from '@chakra-ui/react';
import { ServiceLayout } from '@/components/service_layout';
import { GooleLoginButton } from '@/components/google_login_button';
import { useAuth } from '@/contexts/auth.user.context';

const IndexPage: NextPage = function () {
  const { signInWithGoogle, authUser } = useAuth();
  console.log('userdata', authUser);
  return (
    <ServiceLayout title="test">
      <Box maxW="md" mx="auto">
        <img src="/main_logo.svg" alt="메인 로고" />
        <Flex justify="center">
          <Heading>#BlahBlah</Heading>
        </Flex>
      </Box>
      <Center mt="20">
        <GooleLoginButton onClick={signInWithGoogle} />
      </Center>
    </ServiceLayout>
  );
};

export default IndexPage;
