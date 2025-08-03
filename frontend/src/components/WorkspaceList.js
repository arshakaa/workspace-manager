import React, { useState } from 'react';
import {
    VStack,
    HStack,
    Heading,
    Button,
    Text,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Badge,
    IconButton,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    Flex,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import WorkspaceForm from './WorkspaceForm';
import { useWorkspaces } from '../hooks/useWorkspaces';

const WorkspaceList = ({ user }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    const {
        workspaces,
        loading,
        error,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
    } = useWorkspaces();

    const handleCreateWorkspace = () => {
        setEditingWorkspace(null);
        setShowForm(true);
    };

    const handleEditWorkspace = (workspace) => {
        setEditingWorkspace(workspace);
        setShowForm(true);
    };

    const handleWorkspaceCreated = () => {
        setShowForm(false);
    };

    const handleWorkspaceUpdated = () => {
        setShowForm(false);
        setEditingWorkspace(null);
    };

    const handleDeleteClick = (workspace) => {
        setWorkspaceToDelete(workspace);
        onOpen();
    };

    const handleDeleteConfirm = async () => {
        if (!workspaceToDelete) return;

        await deleteWorkspace(workspaceToDelete.id);
        setWorkspaceToDelete(null);
        onClose();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingWorkspace(null);
    };

    if (loading) {
        return (
            <Center py={10}>
                <VStack spacing={4}>
                    <Spinner size="xl" />
                    <Text>Loading workspaces...</Text>
                </VStack>
            </Center>
        );
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    if (showForm) {
        return (
            <WorkspaceForm
                workspace={editingWorkspace}
                onWorkspaceCreated={handleWorkspaceCreated}
                onWorkspaceUpdated={handleWorkspaceUpdated}
                onCancel={handleCancel}
                createWorkspace={createWorkspace}
                updateWorkspace={updateWorkspace}
            />
        );
    }

    return (
        <>
            <VStack
                spacing={6}
                align="stretch">
                <HStack
                    justify="space-between"
                    align="center">
                    <Heading size="lg">My Workspaces</Heading>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        onClick={handleCreateWorkspace}>
                        Create Workspace
                    </Button>
                </HStack>

                {workspaces.length === 0 ? (
                    <Card>
                        <CardBody>
                            <VStack
                                spacing={4}
                                py={8}>
                                <Text
                                    fontSize="lg"
                                    fontWeight="medium"
                                    color="gray.600">
                                    No workspaces yet
                                </Text>
                                <Text
                                    textAlign="center"
                                    color="gray.500">
                                    Create your first workspace to get started!
                                </Text>
                                <Button
                                    colorScheme="blue"
                                    onClick={handleCreateWorkspace}>
                                    Create Workspace
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>
                ) : (
                    <Flex
                        wrap="wrap"
                        gap={4}>
                        {workspaces.map((workspace) => (
                            <Card
                                key={workspace.id}
                                variant="outline"
                                maxW="300px"
                                flex="0 0 auto">
                                <CardHeader pb={2}>
                                    <VStack
                                        align="start"
                                        spacing={2}>
                                        <Heading size="md">
                                            {workspace.name}
                                        </Heading>
                                        <Badge
                                            colorScheme="blue"
                                            variant="subtle">
                                            {workspace.slug}
                                        </Badge>
                                    </VStack>
                                </CardHeader>
                                <CardBody pt={0}>
                                    <Text
                                        fontSize="sm"
                                        color="gray.600">
                                        Created{' '}
                                        {new Date(
                                            workspace.created_at
                                        ).toLocaleDateString()}
                                    </Text>
                                </CardBody>
                                <CardFooter pt={2}>
                                    <HStack
                                        spacing={2}
                                        w="100%">
                                        <Button
                                            leftIcon={<EditIcon />}
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleEditWorkspace(workspace)
                                            }>
                                            Edit
                                        </Button>
                                        <IconButton
                                            icon={<DeleteIcon />}
                                            variant="outline"
                                            colorScheme="red"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteClick(workspace)
                                            }
                                            aria-label="Delete workspace"
                                        />
                                    </HStack>
                                </CardFooter>
                            </Card>
                        ))}
                    </Flex>
                )}
            </VStack>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader
                            fontSize="lg"
                            fontWeight="bold">
                            Delete Workspace
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete "
                            {workspaceToDelete?.name}"? This action cannot be
                            undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteConfirm}
                                ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default WorkspaceList;
