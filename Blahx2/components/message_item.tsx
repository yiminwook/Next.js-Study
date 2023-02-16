import { Avatar, Box, Text, Flex, Divider, Textarea, Button } from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import React, { useState } from 'react';
import axios from 'axios';
import { InMessage } from '@/models/message/in_message';
import converDateToString from '@/utils/convert_date_to_string';

interface Props {
  uid: string;
  displayName: string;
  photoURL: string;
  isOwner: boolean;
  item: InMessage;
  onSendComplete: () => void;
}
const MessageItem = function ({ uid, displayName, isOwner, photoURL, item, onSendComplete }: Props) {
  const [reply, setReply] = useState('');

  async function postReply() {
    const result = await axios.post('api/messages.add.reply', {
      headers: { 'Content-type': 'application/json' },
      data: {
        uid,
        messageId: item.id,
        reply,
      },
    });
    if (result.status < 300) {
      onSendComplete();
    }
  }

  const haveReply = item.reply !== undefined;
  return (
    <Box borderRadius="md" width="full" bg="white" boxShadow="md">
      <Box>
        <Flex pl="2" pt="2" alignItems="center">
          <Avatar size="xs" src={item.author ? item.author.photoURL ?? '/user.png' : '/user.png'} />
          <Text fontSize="xx-small" ml="1">
            {item.author ? item.author.displayName : 'anonymous'}
          </Text>
          <Text whiteSpace="pre-line" fontSize="xx-small" color="gray.500" ml="1">
            {converDateToString(item.createAt)}
          </Text>
        </Flex>
      </Box>
      <Box p="2">
        <Box borderRadius="md" borderWidth="1px" p="2">
          <Text whiteSpace="pre-line" fontSize="sm">
            {item.message}
          </Text>
        </Box>
        {/* 댓글영역 */}
        {haveReply && (
          <Box pt="2">
            <Divider />
            <Box display="flex" mt="2">
              <Box pt="2">
                <Avatar size="xs" mr="2" src={photoURL ?? '/user.png'} />
              </Box>
              <Box borderRadius="md" p="2" width="full" bg="gray.100">
                <Flex alignItems="center">
                  <Text fontSize="xs">{displayName}</Text>
                  <Text whiteSpace="pre-line" fontSize="xs" color="gray">
                    {converDateToString(item.replyAt!)}
                  </Text>
                </Flex>
                <Text whiteSpace="pre-line" fontSize="xs">
                  {item.reply}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
        {haveReply === false && isOwner && (
          <Box pt="2">
            <Divider />
            <Box display="flex" mt="2">
              <Avatar size="xs" mr="2" src={photoURL ?? '/user.png'} />
              <Box mr="2" borderRadius="md" width="full" bg="gray.100">
                <Textarea
                  border="none"
                  boxShadow="none !important"
                  resize="none"
                  minH="unset"
                  overflow="hidden"
                  fontSize="xs"
                  placeholder="댓글을 입력하세요..."
                  as={TextareaAutosize}
                  value={reply}
                  onChange={(e) => setReply(e.currentTarget.value)}
                />
              </Box>
              <Button
                disabled={reply.length === 0}
                colorScheme="pink"
                bgColor="#ff75B6"
                variant="solid"
                size="sm"
                onClick={() => postReply()}
              >
                등록
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageItem;
