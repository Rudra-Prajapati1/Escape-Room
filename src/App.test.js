import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameProvider, useGame } from "./GameContext";

function TestHarness() {
  const { gameState, goToLevel, nextLevel } = useGame();

  return (
    <div>
      <span data-testid="level">{gameState.currentLevel}</span>
      <button onClick={() => goToLevel(2)}>Start Level 1</button>
      <button onClick={() => nextLevel(2)}>Advance Guarded</button>
    </div>
  );
}

test("nextLevel ignores stale callbacks from an already-finished level", async () => {
  const user = userEvent.setup();

  render(
    <GameProvider>
      <TestHarness />
    </GameProvider>,
  );

  await user.click(screen.getByRole("button", { name: "Start Level 1" }));
  expect(screen.getByTestId("level")).toHaveTextContent("2");

  await user.click(screen.getByRole("button", { name: "Advance Guarded" }));
  expect(screen.getByTestId("level")).toHaveTextContent("3");

  await user.click(screen.getByRole("button", { name: "Advance Guarded" }));
  expect(screen.getByTestId("level")).toHaveTextContent("3");
});
