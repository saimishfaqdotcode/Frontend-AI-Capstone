import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Chat from "./Chat";

const mockSendMessage = vi.fn();
const mockStop = vi.fn();
const mockRegenerate = vi.fn();

let mockChatState;

vi.mock("@ai-sdk/react", () => ({
  useChat: () => mockChatState,
}));

function createChatState(overrides = {}) {
  return {
    messages: [],
    sendMessage: mockSendMessage,
    stop: mockStop,
    regenerate: mockRegenerate,
    status: "ready",
    error: undefined,
    ...overrides,
  };
}

describe("Chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockChatState = createChatState();
  });

  it("renders the empty chat state", () => {
    render(<Chat />);

    expect(
      screen.getByRole("heading", { name: "How can I help?" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Ask me about web development, debugging, or website analysis."
      )
    ).toBeInTheDocument();
  });

  it("renders a user text message", () => {
    mockChatState = createChatState({
      messages: [
        {
          id: "user-1",
          role: "user",
          parts: [
            {
              type: "text",
              text: "Explain React hooks",
            },
          ],
        },
      ],
    });

    render(<Chat />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Explain React hooks")).toBeInTheDocument();
  });

  it("renders an assistant text message", () => {
    mockChatState = createChatState({
      messages: [
        {
          id: "assistant-1",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "React hooks let components use state and other React features.",
            },
          ],
        },
      ],
    });

    render(<Chat />);

    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(
      screen.getByText(
        "React hooks let components use state and other React features."
      )
    ).toBeInTheDocument();
  });

  it("shows the pending Thinking state", () => {
    mockChatState = createChatState({
      status: "submitted",
      messages: [
        {
          id: "user-1",
          role: "user",
          parts: [{ type: "text", text: "Hello" }],
        },
      ],
    });

    render(<Chat />);

    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("shows the streaming Generating state", () => {
    mockChatState = createChatState({
      status: "streaming",
      messages: [
        {
          id: "user-1",
          role: "user",
          parts: [{ type: "text", text: "Tell me about React" }],
        },
      ],
    });

    render(<Chat />);

    expect(screen.getByText("Generating...")).toBeInTheDocument();
  });

  it("renders the tool input state", () => {
    mockChatState = createChatState({
      messages: [
        {
          id: "tool-1",
          role: "assistant",
          parts: [
            {
              type: "tool-analyzeWebsite",
              state: "input-available",
              input: {
                url: "https://example.com",
              },
            },
          ],
        },
      ],
    });

    render(<Chat />);

    expect(
      screen.getByText("Website analysis requested")
    ).toBeInTheDocument();

    expect(screen.getByText("https://example.com")).toBeInTheDocument();
  });

  it("renders a successful website analysis result", () => {
    mockChatState = createChatState({
      messages: [
        {
          id: "tool-2",
          role: "assistant",
          parts: [
            {
              type: "tool-analyzeWebsite",
              state: "output-available",
              output: {
                url: "https://example.com",
                title: "Example Domain",
                description: "Example website description",
                titleFound: true,
                descriptionFound: true,
                analyzedAt: "2026-08-19T07:00:00.000Z",
              },
            },
          ],
        },
      ],
    });

    render(<Chat />);

    expect(
      screen.getByRole("heading", { name: "Website Analysis" })
    ).toBeInTheDocument();

    expect(screen.getByText("Example Domain")).toBeInTheDocument();
    expect(
      screen.getByText("Example website description")
    ).toBeInTheDocument();

    expect(screen.getAllByText("Yes")).toHaveLength(2);
  });

  it("renders the tool error state", () => {
    mockChatState = createChatState({
      messages: [
        {
          id: "tool-3",
          role: "assistant",
          parts: [
            {
              type: "tool-analyzeWebsite",
              state: "output-error",
              errorText: "Unable to reach the website.",
            },
          ],
        },
      ],
    });

    render(<Chat />);

    expect(
      screen.getByText("Website analysis failed")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Unable to reach the website.")
    ).toBeInTheDocument();
  });

  it("renders the AI response error and retry action", () => {
    mockChatState = createChatState({
      error: new Error("Request failed"),
    });

    render(<Chat />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Retry" })
    ).toBeInTheDocument();
  });
});