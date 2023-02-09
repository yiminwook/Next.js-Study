import { GetServerSideProps, NextPage } from 'next';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { ServiceLayout } from '@/components/service_layout';
import { useAuth } from '@/contexts/auth.user.context';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';

interface Props {
  userInfo: InAuthUser | null;
}

async function postMessage({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: { displayName: string; photoURL?: string };
}) {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메세지를 입력해주세요',
    };
  }
  try {
    await axios.post('api/messages.add', {
      headers: { 'content-type': 'application.json' },
      data: {
        uid,
        message,
        author,
      },
    });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: '메세지 등록 실패',
    };
  }
}

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  const [message, setMessage] = useState('');
  const [isAnonymous, setAnonymous] = useState(true);
  const toast = useToast();
  const { authUser } = useAuth();

  if (userInfo === null) {
    //err 페이지
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  return (
    <ServiceLayout title={`${userInfo.displayName ?? '유저'} 홈페이지`} minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? '/user.png'} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex align="center" p="2">
            <Avatar size="xs" mr="2" src={isAnonymous ? '/user.png' : authUser?.photoURL ?? '/user.png'} />
            <Textarea
              bg="gray.100"
              placeholder="무엇이 궁금한가요?"
              border="none"
              resize="none" //사용자가 크기를 수정할 수 없게함.
              minH="unset"
              overflow="hidden"
              fontSize="xs"
              mr="2"
              maxRows={6}
              value={message}
              onChange={(e) => {
                if (e.currentTarget.value) {
                  const lineCount = e.currentTarget.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1;
                  if (lineCount > 6) {
                    toast({ title: '최대 7줄까지만 입력가능합니다.', position: 'top-right' });
                    return;
                  }
                }
                setMessage(e.currentTarget.value);
              }}
              as={TextareaAutosize}
            />
            <Button
              disabled={message.length === 0} //입력값이 없으면 비활성화
              bgColor="#FFB86C"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              onClick={async () => {
                const postData: {
                  uid: string;
                  message: string;
                  author?: {
                    displayName: string;
                    photoURL?: string;
                  };
                } = { uid: userInfo.uid, message };
                if (isAnonymous === false) {
                  postData.author = {
                    displayName: authUser?.displayName ?? 'anonymous',
                    photoURL: authUser?.photoURL ?? '/user.png',
                  };
                }
                const messageResp = await postMessage(postData);
                if (messageResp.result === false) {
                  toast({ title: messageResp.message, position: 'top-right' });
                }
                setMessage('');
              }}
            >
              등록
            </Button>
          </Flex>
          {/* mx: left + right */}
          <FormControl display="flex" alignItems="center" mt="1" mx="2" pb="2">
            <Switch
              size="sm"
              colorScheme="orange"
              id="anonymous"
              mr="1"
              isChecked={isAnonymous}
              onChange={() => {
                if (authUser === null) {
                  toast({ title: '로그인이 필요합니다.', position: 'top-right' });
                  return;
                }
                setAnonymous(!isAnonymous);
              }}
            />
            {/* switch의 id값을 참조 */}
            <FormLabel htmlFor="anonymous" mb="0" fontSize="xx-small">
              Anonymous
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing="12px" mt="6">
          <MessageItem
            uid="uid"
            displayName="displayName"
            isOwner
            photoURL={authUser?.photoURL ?? ''}
            item={{
              id: 'itemID',
              message: 'itemMessage',
              reply: 'reply',
              replyAt: '2022-06-22T20:25:44+09:00',
              createAt: '2022-06-20T20:25:44+09:00',
            }}
          />
          <MessageItem
            uid="uid"
            displayName="displayName"
            isOwner
            photoURL="photo"
            item={{
              id: 'itemID',
              message: 'itemMessage',
              // reply: 'reply',
              // replyAt: '2022-06-22T20:25:44+09:00',
              createAt: '2022-06-20T20:25:44+09:00',
            }}
          />
        </VStack>
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
  try {
    const protocol = process.env.PROTOCOL || ' http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios.get(`${baseUrl}/api/user.info/${screenName}`);
    return {
      props: {
        userInfo: userInfoResp?.data ?? null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
      },
    };
  }
};
export default UserHomePage;
