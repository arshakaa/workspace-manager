import React from 'react';
import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    Button,
    HStack,
} from '@chakra-ui/react';

const Header = ({ user, onLogout }) => {
    return (
        <Box
            bg="white"
            shadow="sm"
            borderBottom="1px"
            borderColor="gray.200">
            <Container
                maxW="container.xl"
                py={4}>
                <Flex
                    justify="space-between"
                    align="center">
                    <Heading
                        as="h1"
                        size="lg"
                        color="blue.600">
                        Workspace Manager
                    </Heading>
                    {user && (
                        <HStack spacing={4}>
                            <Text color="gray.600">
                                Welcome, {user.fullName}
                            </Text>
                            <Button
                                variant="outline"
                                colorScheme="gray"
                                size="sm"
                                onClick={onLogout}>
                                Logout
                            </Button>
                        </HStack>
                    )}
                </Flex>
            </Container>
        </Box>
    );
};

export default Header;
