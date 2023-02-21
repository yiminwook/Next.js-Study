/* eslint-disable react-hooks/exhaustive-deps */
import { GetServerSideProps, NextPage } from 'next';
import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Link from 'next/link';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { useAuth } from '@/contexts/auth.user.context';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';
import { ServiceLayout } from '@/components/service_layout';

interface Props {
  userInfo: InAuthUser | null;
  initMsgData: InMessage | null;
  screenName: string | undefined;
  baseUrl: string;
}

/** 메세지 단건에대한 페이지 */
const MessagePage: NextPage<Props> = function ({ userInfo, initMsgData, screenName, baseUrl }) {
  const [messageData, setMessageData] = useState<null | InMessage>(null);
  useEffect(() => setMessageData(() => initMsgData), []);
  const { authUser } = useAuth();
  async function getMesaageInfo({ uid, messageId }: { uid: string; messageId: string }) {
    try {
      const result: AxiosResponse<InMessage> = await axios.get(`/api/messages.info?uid=${uid}&messageId=${messageId}`);
      if (result.status === 200) {
        setMessageData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  if (userInfo === null || messageData === null || screenName === undefined) {
    //err 페이지
    return <p>사용자를 찾을 수 없습니다.</p>;
  }
  const isOwner = authUser !== null && authUser.uid === userInfo.uid;
  const metaImgUrl = `${baseUrl}/open-graph-img?text=${encodeURIComponent(messageData.message)}`;
  const thumbnailImgUrl = `${baseUrl}/api/thumbnail?url=${encodeURIComponent(metaImgUrl)}`;
  return (
    <>
      <Head>
        <meta property="og:image" content={thumbnailImgUrl} />
        <meta name="twitter:image" content={thumbnailImgUrl} />
        <meta name="twitter:site" content="@blahx2" />
        <meta name="twitter:title" content={messageData.message} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ServiceLayout title={`${userInfo.displayName ?? ''}의 메세지`} minH="100vh" backgroundColor="gray.50">
        <Box maxW="md" mx="auto" pt="6">
          <Link href={`/${screenName}`}>
            <a>
              <Button leftIcon={<ChevronLeftIcon />} mb="2" fontSize="sm">
                {userInfo.displayName ?? ''}의 홈으로
              </Button>
            </a>
          </Link>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
            <Flex p="6">
              <Avatar size="lg" src={userInfo.photoURL ?? '/user.png'} mr="2" />
              <Flex direction="column" justify="center">
                <Text fontSize="md">{userInfo.displayName}</Text>
                <Text fontSize="xs">{userInfo.email}</Text>
              </Flex>
            </Flex>
          </Box>
          <MessageItem
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
        </Box>
      </ServiceLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName, messageId } = query;
  const name = Array.isArray(screenName) ? screenName[0] : screenName;
  if (screenName === undefined || messageId === undefined) {
    return {
      props: {
        userInfo: null,
        initMsgData: null,
        screenName: name,
        baseUrl: '',
      },
    };
  }
  try {
    const protocol = process.env.PROTOCOL || ' http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios.get(`${baseUrl}/api/user.info/${name}`);

    if (userInfoResp.status !== 200 || userInfoResp.data === undefined || userInfoResp.data.uid === undefined) {
      return {
        props: {
          userInfo: userInfoResp.data ?? null,
          initMsgData: null,
          screenName: name,
          baseUrl,
        },
      };
    }

    const messageInfoResp: AxiosResponse<InMessage> = await axios.get(
      `${baseUrl}/api/messages.info?uid=${userInfoResp.data.uid}&messageId=${messageId}`,
    );
    return {
      props: {
        userInfo: userInfoResp.data ?? null,
        initMsgData: messageInfoResp.status !== 200 || messageInfoResp.data === undefined ? null : messageInfoResp.data,
        screenName: name,
        baseUrl,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
        initMsgData: null,
        screenName: name,
        baseUrl: '',
      },
    };
  }
};
export default MessagePage;
