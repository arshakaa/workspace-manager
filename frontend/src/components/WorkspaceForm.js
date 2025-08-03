import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    HStack,
    useToast,
    FormErrorMessage,
    Code,
    Spinner,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { normalizeSlug, debounce } from '../utils/slugUtils';
import apiClient from '../api';

const WorkspaceForm = ({
    workspace,
    onWorkspaceCreated,
    onWorkspaceUpdated,
    onCancel,
    createWorkspace,
    updateWorkspace,
}) => {
    const [slugStatus, setSlugStatus] = useState({
        checking: false,
        available: null,
        suggestion: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
        trigger,
    } = useForm();

    const slug = watch('slug');
    const isEditMode = !!workspace;

    useEffect(() => {
        if (workspace) {
            reset({
                name: workspace.name,
                slug: workspace.slug,
            });
        }
    }, [workspace, reset]);

    const debouncedSlugCheck = useCallback(
        debounce(async (slug) => {
            if (!slug || slug.length < 2) {
                setSlugStatus({
                    checking: false,
                    available: null,
                    suggestion: '',
                });
                return;
            }

            setSlugStatus({ checking: true, available: null, suggestion: '' });

            try {
                const response = await apiClient.checkSlugAvailability(slug);
                setSlugStatus({
                    checking: false,
                    available: response.available,
                    suggestion: response.suggestion || '',
                });
            } catch (error) {
                setSlugStatus({
                    checking: false,
                    available: null,
                    suggestion: '',
                });
            }
        }, 300),
        [isEditMode, workspace?.slug, apiClient]
    );

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await updateWorkspace(workspace.id, data.name, data.slug);
                onWorkspaceUpdated();
            } else {
                await createWorkspace(data.name, data.slug);
                onWorkspaceCreated();
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
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="md"
            mb={6}>
            <VStack
                spacing={6}
                align="stretch">
                <Text
                    fontSize="xl"
                    fontWeight="bold">
                    {isEditMode ? 'Edit Workspace' : 'Create New Workspace'}
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack
                        spacing={4}
                        align="stretch">
                        <FormControl isInvalid={errors.name}>
                            <FormLabel>Workspace Name</FormLabel>
                            <Input
                                type="text"
                                placeholder="Enter workspace name"
                                {...register('name', {
                                    required: 'Workspace name is required',
                                    minLength: {
                                        value: 2,
                                        message:
                                            'Name must be at least 2 characters',
                                    },
                                    onChange: (e) => {
                                        const name = e.target.value;
                                        const normalizedSlug =
                                            normalizeSlug(name);
                                        setValue('slug', normalizedSlug);
                                        trigger('slug');
                                        debouncedSlugCheck(normalizedSlug);
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.slug}>
                            <FormLabel>Slug</FormLabel>
                            <Input
                                type="text"
                                placeholder="workspace-slug"
                                {...register('slug', {
                                    required: 'Slug is required',
                                    pattern: {
                                        value: /^[a-z0-9-]+$/,
                                        message:
                                            'Slug can only contain lowercase letters, numbers, and hyphens',
                                    },
                                    onChange: (e) =>
                                        debouncedSlugCheck(e.target.value),
                                })}
                            />
                            <FormErrorMessage>
                                {errors.slug && errors.slug.message}
                            </FormErrorMessage>

                            {slug && (
                                <HStack
                                    spacing={2}
                                    mt={2}>
                                    {slugStatus.checking ? (
                                        <>
                                            <Spinner size="sm" />
                                            <Text
                                                fontSize="sm"
                                                color="yellow.600">
                                                Checking availability...
                                            </Text>
                                        </>
                                    ) : slugStatus.available === true ? (
                                        <>
                                            <CheckIcon color="green.500" />
                                            <Text
                                                fontSize="sm"
                                                color="green.600">
                                                Available
                                            </Text>
                                        </>
                                    ) : slugStatus.available === false ? (
                                        <>
                                            <CloseIcon color="red.500" />
                                            <Text
                                                fontSize="sm"
                                                color="red.600">
                                                Not available
                                            </Text>
                                        </>
                                    ) : null}
                                </HStack>
                            )}

                            {slugStatus.suggestion && !slugStatus.available && (
                                <Alert
                                    status="info"
                                    mt={2}>
                                    <AlertIcon />
                                    <Box>
                                        <Text fontSize="sm">
                                            Suggested:{' '}
                                            <Code fontSize="sm">
                                                {slugStatus.suggestion}
                                            </Code>
                                        </Text>
                                        <Button
                                            size="xs"
                                            colorScheme="blue"
                                            mt={1}
                                            onClick={() => {
                                                setValue(
                                                    'slug',
                                                    slugStatus.suggestion
                                                );
                                                trigger('slug');
                                                debouncedSlugCheck(
                                                    slugStatus.suggestion
                                                );
                                            }}>
                                            Use this
                                        </Button>
                                    </Box>
                                </Alert>
                            )}
                        </FormControl>

                        <HStack spacing={3}>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={isSubmitting}
                                loadingText={
                                    isEditMode ? 'Updating...' : 'Creating...'
                                }
                                disabled={slugStatus.checking}
                                flex={1}>
                                {isEditMode
                                    ? 'Update Workspace'
                                    : 'Create Workspace'}
                            </Button>

                            {onCancel && (
                                <Button
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                    flex={1}>
                                    Cancel
                                </Button>
                            )}
                        </HStack>
                    </VStack>
                </form>
            </VStack>
        </Box>
    );
};

export default WorkspaceForm;
