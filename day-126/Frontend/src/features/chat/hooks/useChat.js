import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initializeSocketConnection } from '../service/chat.socket';
import {
  sendMessage as apiSendMessage,
  getChats as apiGetChats,
  getMessages as apiGetMessages,
  deleteChat as apiDeleteChat,
} from '../service/chat.api';
import {
  setChats,
  setCurrentChatId,
  setLoading,
} from '../chat.slice';

export const useChat = () => {
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Redux Selectors
  const chats = useSelector((state) => state.chat.chats) || {};
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);

  const currentChat = chats[currentChatId];
  const messages = currentChat?.messages || [];

  // Keep a ref of chats to prevent closures & dependency loops in useEffect
  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // Load chats on mount
  useEffect(() => {
    initializeSocketConnection();

    const loadChats = async () => {
      try {
        dispatch(setLoading(true));
        const response = await apiGetChats();
        const chatsObj = {};
        if (response?.chats) {
          response.chats.forEach((c) => {
            chatsObj[c._id] = {
              ...c,
              messages: []
            };
          });
        }
        dispatch(setChats(chatsObj));
      } catch (err) {
        console.error('Failed to load chats:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadChats();
  }, [dispatch]);

  // Fetch messages when currentChatId changes
  useEffect(() => {
    if (!currentChatId) return;

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await apiGetMessages(currentChatId);
        const currentChats = chatsRef.current;
        dispatch(
          setChats({
            ...currentChats,
            [currentChatId]: {
              ...currentChats[currentChatId],
              messages: response.messages || []
            }
          })
        );
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [currentChatId, dispatch]);

  // Handle message sending
  const handleSendMessage = async (messageText) => {
    const trimmed = messageText.trim();
    if (!trimmed || isTyping) return;

    setIsTyping(true);

    try {
      const activeId = currentChatId;
      let tempId = null;

      // Optimistic update for existing chat
      const currentChatsBefore = chatsRef.current;
      if (activeId) {
        tempId = `temp-${Date.now()}`;
        const tempMsg = { _id: tempId, role: 'user', content: trimmed };
        dispatch(
          setChats({
            ...currentChatsBefore,
            [activeId]: {
              ...currentChatsBefore[activeId],
              messages: [...(currentChatsBefore[activeId]?.messages || []), tempMsg]
            }
          })
        );
      }

      // Call API layer
      const response = await apiSendMessage({
        message: trimmed,
        chatId: activeId || undefined
      });

      const { chat: returnedChat, aiMessage, userMessage } = response;
      const returnedChatId = activeId || returnedChat?._id || userMessage?.chat;
      const currentChatsAfter = chatsRef.current;

      let updatedMessages = [];
      if (activeId) {
        updatedMessages = (currentChatsAfter[activeId]?.messages || [])
          .filter((m) => m._id !== tempId)
          .concat(userMessage, aiMessage);
      } else {
        updatedMessages = [userMessage, aiMessage];
      }

      dispatch(
        setChats({
          ...currentChatsAfter,
          [returnedChatId]: {
            ...(returnedChat || currentChatsAfter[returnedChatId] || {}),
            messages: updatedMessages
          }
        })
      );

      if (!activeId) {
        dispatch(setCurrentChatId(returnedChatId));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Delete specific chat session
  const handleDeleteChat = async (chatId) => {
    try {
      await apiDeleteChat(chatId);
      const currentChats = chatsRef.current;
      const updatedChats = { ...currentChats };
      delete updatedChats[chatId];
      dispatch(setChats(updatedChats));
      if (currentChatId === chatId) {
        dispatch(setCurrentChatId(null));
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const startNewChat = () => {
    dispatch(setCurrentChatId(null));
  };

  const selectChat = (chatId) => {
    dispatch(setCurrentChatId(chatId));
  };

  return {
    chats,
    currentChatId,
    currentChat,
    messages,
    isLoading,
    loadingMessages,
    isTyping,
    handleSendMessage,
    handleDeleteChat,
    startNewChat,
    selectChat
  };
};
