import { test, expect } from "@playwright/test";

test("user can start the primary chat flow", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: [
        'data: {"type":"start","messageId":"test-message"}\n\n',
        'data: {"type":"text-start","id":"text-1"}\n\n',
        'data: {"type":"text-delta","id":"text-1","delta":"React hooks let functional components use state and other React features."}\n\n',
        'data: {"type":"text-end","id":"text-1"}\n\n',
        'data: {"type":"finish"}\n\n',
      ].join(""),
    });
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "AI Assistant" })
  ).toBeVisible();

  const messageBox = page.getByPlaceholder("Message the AI...");

  await messageBox.fill("Explain React hooks in simple terms");

  const sendButton = page
    .locator("form")
    .getByRole("button", { name: "Send" });

  await expect(sendButton).toBeEnabled();

  await sendButton.click();

  await expect(
    page.getByText(
      "React hooks let functional components use state and other React features."
    )
  ).toBeVisible();
});