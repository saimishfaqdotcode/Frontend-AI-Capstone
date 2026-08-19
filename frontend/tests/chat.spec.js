import { test, expect } from "@playwright/test";

test("user can start the primary chat flow", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "React hooks let functional components use state and other React features.",
      }),
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
    page.getByText(/Thinking|Generating/)
  ).toBeVisible();
});