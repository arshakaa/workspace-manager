import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
    useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import apiClient from '../api';

const AuthForm = ({ currentPage, onSwitchMode, onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const toast = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const isLogin = currentPage === 'login';

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (isLogin) {
                const response = await apiClient.login(
                    data.email,
                    data.password
                );
                onLogin(response.user);
            } else {
                const response = await apiClient.signup(
                    data.fullName,
                    data.email,
                    data.password
                );
                onLogin(response.user);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'An error occurred',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            bg="white"
            p={8}
            borderRadius="lg"
            shadow="md"
            maxW="400px"
            w="100%"
            mx="auto">
            <VStack
                spacing={6}
                align="stretch">
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign="center">
                    {isLogin ? 'Login' : 'Sign Up'}
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack
                        spacing={4}
                        align="stretch">
                        {!isLogin && (
                            <FormControl isInvalid={errors.fullName}>
                                <FormLabel>Full Name</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter your full name"
                                    {...register('fullName', {
                                        required: 'Full name is required',
                                        minLength: {
                                            value: 2,
                                            message:
                                                'Name must be at least 2 characters',
                                        },
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.fullName && errors.fullName.message}
                                </FormErrorMessage>
                            </FormControl>
                        )}

                        <FormControl isInvalid={errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                {errors.email && errors.email.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.password}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message:
                                                'Password must be at least 6 characters',
                                        },
                                    })}
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        icon={
                                            showPassword ? (
                                                <ViewOffIcon />
                                            ) : (
                                                <ViewIcon />
                                            )
                                        }
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                                {errors.password && errors.password.message}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            isLoading={isLoading}
                            loadingText={
                                isLogin
                                    ? 'Logging in...'
                                    : 'Creating account...'
                            }
                            w="100%">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </Button>
                    </VStack>
                </form>

                <Text
                    textAlign="center"
                    fontSize="sm"
                    color="gray.600">
                    {isLogin ? (
                        <>
                            Don't have an account?{' '}
                            <Button
                                variant="link"
                                colorScheme="blue"
                                size="sm"
                                onClick={() => onSwitchMode('signup')}>
                                Sign up here
                            </Button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <Button
                                variant="link"
                                colorScheme="blue"
                                size="sm"
                                onClick={() => onSwitchMode('login')}>
                                Login here
                            </Button>
                        </>
                    )}
                </Text>
            </VStack>
        </Box>
    );
};

export default AuthForm;
