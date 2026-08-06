import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../auth/hook/useAuth';
import ReactMarkdown from 'react-markdown';
import { ThemeToggle } from '../../../components/ThemeToggle';

/* ─── Icon Helpers ─── */
const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconChat = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 shrink-0 text-theme-muted"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const IconSend = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const IconMenu = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const IconSparkle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
    />
  </svg>
);

const IconSparkleSmall = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-[18px] w-[18px]"
    fill="none"
    viewBox="0 3 18 18"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
    />
  </svg>
);

const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-3.5 w-3.5 text-theme-muted hover:text-red-400 transition-colors shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const IconLogout = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-theme-muted group-hover/logout:text-red-400 transition-colors shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

/* ─── Render Helper to Split & Format Content ─── */
const renderContent = (content) => {
  if (!content) return null;

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mt-2 first:mt-0 whitespace-pre-wrap">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mt-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mt-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-theme-text text-sm">{children}</li>,
        h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-theme-text font-display">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-1.5 text-theme-text font-display">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1 text-theme-text font-display">{children}</h3>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-theme-accent hover:underline">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-theme-border pl-4 py-1 my-2 italic text-theme-muted bg-theme-card/30 rounded-r">
            {children}
          </blockquote>
        ),
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match;
          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-theme-input border border-theme-border text-xs text-theme-accent"
                style={{ fontFamily: 'Arial, sans-serif' }}
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <div className="my-3 rounded-xl overflow-hidden border border-theme-border bg-theme-input text-xs animate-fadeIn">
              <div className="flex items-center justify-between px-4 py-1.5 bg-theme-card border-b border-theme-border text-[10px] text-theme-muted font-sans">
                <span>{match[1]}</span>
                <span className="uppercase text-[9px] font-semibold tracking-wider text-theme-muted">
                  Code
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-theme-text leading-relaxed select-all" style={{ fontFamily: 'Arial, sans-serif' }}>
                <code style={{ fontFamily: 'Arial, sans-serif' }}>{String(children).replace(/\n$/, '')}</code>
              </pre>
            </div>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

/* ─── UI Component Layer ─── */
const Dashboard = () => {
  const {
    chats,
    currentChatId,
    currentChat,
    messages,
    loadingMessages,
    isTyping,
    handleSendMessage,
    handleDeleteChat,
    startNewChat,
    selectChat
  } = useChat();

  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteConfirmChatId, setDeleteConfirmChatId] = useState(null);

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    handleLogout();
  };

  const confirmDelete = () => {
    if (deleteConfirmChatId) {
      handleDeleteChat(deleteConfirmChatId);
      setDeleteConfirmChatId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmChatId(null);
  };

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentChatId, isTyping]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;
    setInputValue('');
    handleSendMessage(trimmed);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-theme-bg text-theme-text font-sans transition-colors duration-300">
      {/* ── SIDEBAR ── */}
      <aside
        className={`
          flex flex-col shrink-0 h-full border-r border-theme-border
          bg-theme-bg/90 backdrop-blur-xl transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden border-none'}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-theme-border font-display">
          <span className="text-theme-accent font-bold tracking-tight text-sm">
            NexusAI
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-theme-muted hover:text-theme-text transition-colors duration-200 cursor-pointer"
          >
            <IconMenu />
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => {
              startNewChat();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
              bg-theme-accent/10 border border-theme-accent/25 text-theme-accent
              hover:bg-theme-accent/20 hover:border-theme-accent/40
              transition-all duration-200 text-sm font-display font-medium cursor-pointer"
          >
            <IconPlus />
            New Chat
          </button>
        </div>

        {/* Chat history */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 mt-2 space-y-1 no-scrollbar">
          <p className="text-[10px] font-display font-bold text-theme-muted px-3 uppercase tracking-wider mb-2 select-none">
            Recent Chats
          </p>
          {Object.values(chats)
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .map((item) => {
              const isActive = currentChatId === item._id;
              return (
                <button
                  key={item._id}
                  onClick={() => {
                    selectChat(item._id);
                  }}
                  className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 cursor-pointer
                    ${
                      isActive
                        ? 'bg-theme-card text-theme-text border border-theme-border font-medium'
                        : 'text-theme-muted hover:bg-theme-card hover:text-theme-text border border-transparent'
                    }
                  `}
                >
                  <IconChat />
                  <span className="truncate flex-1">{item.title}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmChatId(item._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded hover:bg-theme-card"
                  >
                    <IconTrash />
                  </span>
                </button>
              );
            })}
        </nav>

        {/* User badge */}
        <div className="px-3 pb-4 border-t border-theme-border pt-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-theme-bg font-bold text-sm shrink-0" style={{ background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-dim))' }}>
              {user?.username?.[0]?.toUpperCase() ??
                user?.email?.[0]?.toUpperCase() ??
                'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-theme-text truncate">
                {user?.username ?? 'User'}
              </p>
              <p className="text-[11px] text-theme-muted truncate">
                {user?.email ?? ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="group/logout w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
              bg-theme-card border border-theme-border text-theme-muted font-display text-xs font-semibold
              hover:bg-red-950/20 hover:border-red-900/30 hover:text-red-400
              transition-all duration-200 cursor-pointer"
          >
            <IconLogout />
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        {/* Gradient background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-[140px]" style={{ background: 'rgba(var(--theme-accent-rgb), 0.06)' }} />
          <div className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full blur-[140px]" style={{ background: 'rgba(var(--theme-accent-rgb), 0.04)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full blur-[120px]" style={{ background: 'rgba(var(--theme-accent-rgb), 0.03)' }} />
        </div>

        {/* Topbar */}
        <header className="relative z-10 flex items-center gap-3 px-5 py-3.5 border-b border-theme-border bg-theme-bg/60 backdrop-blur-xl transition-colors duration-300">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-theme-muted hover:text-theme-text transition-colors duration-200 cursor-pointer mr-1"
            >
              <IconMenu />
            </button>
          )}
          <span className="text-theme-text/80 text-sm font-display font-medium">
            {currentChat ? currentChat.title : 'New Conversation'}
          </span>
          {/* Theme Toggle + Gradient badge */}
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <span className="text-[11px] px-2.5 py-1.5 rounded-full font-semibold tracking-wide text-theme-accent" style={{ background: 'rgba(var(--theme-accent-rgb), 0.10)', border: '1px solid rgba(var(--theme-accent-rgb), 0.25)' }}>
              NexusAI · Online
            </span>
          </div>
        </header>

        {/* Messages / Welcome area */}
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-theme-accent" />
            </div>
          ) : !currentChatId ? (
            /* ── Welcome state ── */
            <div className="flex flex-col items-center justify-center h-full px-6 pb-10 text-center">
              <div className="mb-5 text-theme-accent" style={{ filter: 'drop-shadow(0 0 24px rgba(var(--theme-accent-rgb), 0.35))' }}>
                <IconSparkle />
              </div>
              <h1 className="text-4xl font-display font-black text-theme-text tracking-tight mb-2">
                What can I help with?
              </h1>
              <p className="text-theme-muted text-sm max-w-sm">
                Hi{user?.username ? `, ${user.username}` : ''}! Ask me anything
                — I'm ready to help you build, debug, and create.
              </p>
            </div>
          ) : (
            /* ── Active chat messages ── */
            <div className="flex flex-col gap-6 px-4 py-8 max-w-3xl mx-auto w-full">
              {/* Thread header */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-theme-border" />
                <p className="text-[11px] uppercase tracking-widest text-theme-muted font-semibold">
                  {currentChat?.title}
                </p>
                <div className="flex-1 h-px bg-theme-border" />
              </div>

              {/* Messages Render List */}
              <div className="flex flex-col gap-6 w-full">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex items-start gap-3.5 max-w-[85%] ${
                        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      {/* Avatar */}
                      {isUser ? (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-theme-bg font-bold text-xs shrink-0 select-none" style={{ background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-dim))', boxShadow: '0 4px 12px rgba(var(--theme-accent-rgb), 0.2)' }}>
                          {user?.username?.[0]?.toUpperCase() ??
                            user?.email?.[0]?.toUpperCase() ??
                            'U'}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-accent shrink-0 select-none shadow-sm shadow-black/10">
                          <IconSparkleSmall />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`flex flex-col gap-1.5 ${
                          isUser ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                            ${
                              isUser
                                ? 'rounded-tr-none font-medium text-theme-bg'
                                : 'bg-theme-card border border-theme-border text-theme-text rounded-tl-none'
                            }
                          `}
                          style={isUser ? { background: 'var(--theme-accent)' } : {}}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          ) : (
                            <div className="max-w-none">
                              {renderContent(msg.content)}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-theme-muted px-1 select-none font-medium">
                          {isUser ? 'You' : 'NexusAI'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing/Thinking Loader */}
                {isTyping && (
                  <div className="flex items-start gap-3.5 max-w-[85%] mr-auto animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-accent shrink-0 select-none shadow-sm shadow-black/10">
                      <IconSparkleSmall />
                    </div>
                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm bg-theme-card border border-theme-border text-theme-text rounded-tl-none">
                        <div className="flex items-center gap-1 py-1">
                          <div className="w-2 h-2 rounded-full animate-bounce bg-theme-accent" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full animate-bounce bg-theme-accent" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full animate-bounce bg-theme-accent" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                      <span className="text-[10px] text-theme-muted px-1 select-none font-medium">
                        NexusAI
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Input Bar ── */}
        <div className="relative z-10 px-4 pb-5 pt-3 bg-theme-bg/60 backdrop-blur-xl border-t border-theme-border transition-colors duration-300">
          <div className="max-w-3xl mx-auto">
            <div
              className="relative flex items-end gap-3 px-4 py-3 rounded-2xl bg-theme-card border border-theme-border transition-all duration-300 shadow-lg shadow-black/20 cursor-text"
              style={{ '--tw-ring-color': 'rgba(var(--theme-accent-rgb), 0.15)' }}
              onClick={(e) => {
                if (!e.target.closest('button')) {
                  textareaRef.current?.focus();
                }
              }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message NexusAI…"
                className="flex-1 resize-none bg-transparent text-theme-text placeholder-theme-muted/50 text-sm leading-relaxed focus:outline-none max-h-40 overflow-y-auto"
                style={{ fieldSizing: 'content' }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className={`
                  shrink-0 w-9 h-9 flex items-center justify-center rounded-xl
                  transition-all duration-200 cursor-pointer
                  ${
                    inputValue.trim() && !isTyping
                      ? 'text-theme-bg active:scale-95'
                      : 'bg-theme-card text-theme-muted cursor-not-allowed'
                  }
                `}
                style={inputValue.trim() && !isTyping ? { background: 'var(--theme-accent)', boxShadow: '0 4px 12px rgba(var(--theme-accent-rgb), 0.3)' } : {}}
              >
                <IconSend />
              </button>
            </div>
            <p className="text-center text-[11px] text-theme-muted mt-2.5">
              NexusAI can make mistakes. Consider verifying important info.
            </p>
          </div>
        </div>
      </div>

      {/* ── CUSTOM CONFIRM DELETE MODAL ── */}
      {deleteConfirmChatId && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-theme-card border border-theme-border shadow-2xl shadow-black/50 z-55 animate-scaleIn">
            <h3 className="text-lg font-display font-extrabold text-theme-text mb-2">
              Delete Conversation?
            </h3>
            <p className="text-xs text-theme-muted mb-6 leading-relaxed">
              This will permanently delete this conversation and its history. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-xl border border-theme-border text-theme-text hover:bg-theme-card transition-all duration-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-95 transition-all duration-200 text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
