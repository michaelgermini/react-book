// examples/chapter-5-apis/01-react-query-hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// API configuration
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// API functions
const apiFunctions = {
  // Users
  getUsers: async () => {
    const { data } = await api.get('/users');
    return data;
  },
  
  getUser: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
  
  createUser: async (userData) => {
    const { data } = await api.post('/users', userData);
    return data;
  },
  
  updateUser: async ({ id, ...userData }) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },
  
  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
    return id;
  },
  
  // Posts
  getPosts: async () => {
    const { data } = await api.get('/posts');
    return data;
  },
  
  getPostsByUser: async (userId) => {
    const { data } = await api.get(`/posts?userId=${userId}`);
    return data;
  },
  
  getPost: async (id) => {
    const { data } = await api.get(`/posts/${id}`);
    return data;
  },
  
  createPost: async (postData) => {
    const { data } = await api.post('/posts', postData);
    return data;
  },
  
  updatePost: async ({ id, ...postData }) => {
    const { data } = await api.put(`/posts/${id}`, postData);
    return data;
  },
  
  deletePost: async (id) => {
    await api.delete(`/posts/${id}`);
    return id;
  },
  
  // Comments
  getComments: async (postId) => {
    const { data } = await api.get(`/comments?postId=${postId}`);
    return data;
  },
  
  createComment: async (commentData) => {
    const { data } = await api.post('/comments', commentData);
    return data;
  }
};

// Custom hooks for users
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: apiFunctions.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiFunctions.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiFunctions.createUser,
    onSuccess: (newUser) => {
      // Update users list
      queryClient.setQueryData(['users'], (oldUsers) => {
        return oldUsers ? [...oldUsers, newUser] : [newUser];
      });
      
      // Invalidate users query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiFunctions.updateUser,
    onSuccess: (updatedUser) => {
      // Update specific user
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
      
      // Update user in users list
      queryClient.setQueryData(['users'], (oldUsers) => {
        return oldUsers?.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiFunctions.deleteUser,
    onSuccess: (deletedUserId) => {
      // Remove user from users list
      queryClient.setQueryData(['users'], (oldUsers) => {
        return oldUsers?.filter(user => user.id !== deletedUserId);
      });
      
      // Remove specific user query
      queryClient.removeQueries({ queryKey: ['users', deletedUserId] });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
}

// Custom hooks for posts
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: apiFunctions.getPosts,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePostsByUser(userId) {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => apiFunctions.getPostsByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => apiFunctions.getPost(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiFunctions.createPost,
    onSuccess: (newPost) => {
      // Update posts list
      queryClient.setQueryData(['posts'], (oldPosts) => {
        return oldPosts ? [newPost, ...oldPosts] : [newPost];
      });
      
      // Update user's posts if viewing user posts
      queryClient.setQueryData(['posts', 'user', newPost.userId], (oldPosts) => {
        return oldPosts ? [newPost, ...oldPosts] : [newPost];
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiFunctions.updatePost,
    onSuccess: (updatedPost) => {
      // Update specific post
      queryClient.setQueryData(['posts', updatedPost.id], updatedPost);
      
      // Update post in posts list
      queryClient.setQueryData(['posts'], (oldPosts) => {
        return oldPosts?.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });
      
      // Update post in user's posts
      queryClient.setQueryData(['posts', 'user', updatedPost.userId], (oldPosts) => {
        return oldPosts?.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Failed to update post:', error);
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiFunctions.deletePost,
    onSuccess: (deletedPostId, variables) => {
      // Remove post from posts list
      queryClient.setQueryData(['posts'], (oldPosts) => {
        return oldPosts?.filter(post => post.id !== deletedPostId);
      });
      
      // Remove specific post query
      queryClient.removeQueries({ queryKey: ['posts', deletedPostId] });
      
      // Remove post from user's posts (if we have the user ID)
      if (variables.userId) {
        queryClient.setQueryData(['posts', 'user', variables.userId], (oldPosts) => {
          return oldPosts?.filter(post => post.id !== deletedPostId);
        });
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
    },
  });
}

// Custom hooks for comments
export function useComments(postId) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => apiFunctions.getComments(postId),
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiFunctions.createComment,
    onSuccess: (newComment) => {
      // Update comments for the specific post
      queryClient.setQueryData(['comments', newComment.postId], (oldComments) => {
        return oldComments ? [...oldComments, newComment] : [newComment];
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      console.error('Failed to create comment:', error);
    },
  });
}

// Optimistic updates example
export function useOptimisticUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiFunctions.updatePost,
    onMutate: async (updatedPost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', updatedPost.id] });
      
      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(['posts', updatedPost.id]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['posts', updatedPost.id], updatedPost);
      
      // Return a context object with the snapshotted value
      return { previousPost };
    },
    onError: (err, updatedPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['posts', updatedPost.id], context.previousPost);
    },
    onSettled: (updatedPost) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['posts', updatedPost.id] });
    },
  });
}

// Infinite queries example
export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      api.get(`/posts?_page=${pageParam}&_limit=10`).then(res => res.data),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
}
