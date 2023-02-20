/* eslint-disable react-hooks/exhaustive-deps */
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
import { TriangleDownIcon } from '@chakra-ui/icons';
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { ServiceLayout } from '@/components/service_layout';
import { useAuth } from '@/contexts/auth.user.context';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';

interface Props {
  userInfo: InAuthUser | null;
  screenName: string | undefined;
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
    await axios.post(
      '/api/messages.add',
      {
        uid,
        message,
        author,
      },
      { headers: { 'Content-type': 'application/json' } },
    );
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

const UserHomePage: NextPage<Props> = function ({ userInfo, screenName }) {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  const [isAnonymous, setAnonymous] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();
  const { authUser } = useAuth();
  // 리프레쉬 트리거
  const [messageListFetchTrigger, setMessageListFetchTrigger] = useState(false);
  async function getMesaageInfo({ uid, messageId }: { uid: string; messageId: string }) {
    try {
      const result: AxiosResponse<InMessage> = await axios.get(`/api/messages.info?uid=${uid}&messageId=${messageId}`);
      if (result.status === 200) {
        //리스트가 바뀌면서 하위컴포넌트의 값도 새로 변경
        setMessageList((prev) => {
          const findIndex = prev.findIndex((fv) => fv.id === result.data.id);
          if (findIndex >= 0) {
            const updateArr = [...prev];
            updateArr[findIndex] = result.data;
            return updateArr;
          }
          //변경할 데이터를 찾을 수 없을땐, 이전값을 리턴
          return prev;
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  const messsageListQueryKey = ['messageList', userInfo?.uid, page, messageListFetchTrigger];
  useQuery(
    messsageListQueryKey,
    async () =>
      // eslint-disable-next-line no-return-await
      await axios.get<{
        totalElements: number;
        totalPages: number;
        page: number;
        size: number;
        content: InMessage[];
      }>(`/api/messages.list?uid=${userInfo?.uid}&page=${page}&size=3`),
    {
      keepPreviousData: true, //기존데이터 유지
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setTotalPages(data.data.totalPages);
        if (page === 1) {
          setMessageList([...data.data.content]);
          return;
        }
        setMessageList((prev) => [...prev, ...data.data.content]);
      },
    },
  );

  if (userInfo === null || screenName === undefined) {
    //err 페이지
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  const isOwner = authUser !== null && authUser.uid === userInfo.uid;
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
                // 리프레쉬 글 작성하면 page를 1로 돌려 messageList를 다시 받아온다.
                setPage(1);
                setTimeout(() => {
                  setMessageListFetchTrigger((prev) => !prev);
                });
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
          {messageList.map((messageData) => (
            <MessageItem
              key={`message-item-${userInfo.uid}-${messageData.id}`}
              uid={userInfo.uid}
              screenName={screenName}
              displayName={userInfo.displayName ?? ''}
              isOwner={isOwner}
              photoURL={userInfo.photoURL ?? '/user.png'}
              item={messageData}
              onSendComplete={() => {
                getMesaageInfo({ uid: userInfo.uid, messageId: messageData.id });
              }}
            />
          ))}
        </VStack>
        {totalPages > page && (
          <Button
            leftIcon={<TriangleDownIcon />}
            width="full"
            mt="2"
            fontSize="sm"
            onClick={() => setPage((prev) => prev + 1)}
          >
            더보기
          </Button>
        )}
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName } = query;
  const name = Array.isArray(screenName) ? screenName[0] : screenName;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
        screenName: name,
      },
    };
  }
  try {
    const protocol = process.env.PROTOCOL || ' http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios.get(`${baseUrl}/api/user.info/${name}`);
    return {
      props: {
        userInfo: userInfoResp?.data ?? null,
        screenName: name,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
        screenName: name,
      },
    };
  }
};
export default UserHomePage;
