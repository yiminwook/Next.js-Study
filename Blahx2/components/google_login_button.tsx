import { Box, Button } from '@chakra-ui/react';

interface Props {
  onClick: () => void;
}

export const GooleLoginButton = function ({ onClick }: Props) {
  return (
    <Box>
      <Button
        size="lg"
        width="full"
        maxW="md"
        borderRadius="full"
        bgColor="#4285f4"
        color="white"
        colorScheme="blue"
        leftIcon={
          <img
            src="/google.svg"
            alt="구글 로고"
            style={{ background: 'white', padding: '6px', borderRadius: '100%' }}
          />
        }
        onClick={onClick}
      >
        Goolge 계정으로 시작하기
      </Button>
    </Box>
  );
};
