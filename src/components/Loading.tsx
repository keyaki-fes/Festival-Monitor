import { Container, Spinner } from '@chakra-ui/react'

const Loading = () => {
  return (
    <Container
      mt={4}
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <Spinner />
    </Container>
  )
}

export default Loading
