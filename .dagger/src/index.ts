import { dag, func, argument, Directory, object } from "@dagger.io/dagger";
import { getBunContainer } from "./base.js";

@object()
export class AstroOpengraphImages {
  /**
   * Run linting on the project
   */
  @func()
  async lint(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    return await getBunContainer()
      .withDirectory("/workspace", source)
      .withExec(["bun", "install"])
      .withExec(["bun", "run", "lint"])
      .stdout();
  }

  /**
   * Build the project
   */
  @func()
  async build(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    return await getBunContainer()
      .withDirectory("/workspace", source)
      .withExec(["bun", "install"])
      .withExec(["bun", "run", "build"])
      .stdout();
  }

  /**
   * Test a specific example
   */
  @func()
  async testExample(
    @argument({ defaultPath: "." })
    source: Directory,
    @argument()
    example: string,
  ): Promise<string> {
    // First build the main project
    const builtContainer = getBunContainer()
      .withDirectory("/workspace", source)
      .withExec(["bun", "install"])
      .withExec(["bun", "run", "build"]);

    // Then test the example using the built container
    return await builtContainer
      .withWorkdir(`/workspace/examples/${example}`)
      .withExec(["bun", "install"])
      .withExec(["bun", "run", "build"])
      .stdout();
  }

  /**
   * Run unit tests
   */
  @func()
  async test(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    return await getBunContainer()
      .withDirectory("/workspace", source)
      .withExec(["bun", "install"])
      .withExec(["bun", "run", "test"])
      .stdout();
  }

  /**
   * Run the complete CI pipeline
   */
  @func()
  async ci(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    const baseContainer = getBunContainer()
      .withDirectory("/workspace", source)
      .withExec(["bun", "install"]);

    // Run lint
    await baseContainer.withExec(["bun", "run", "lint"]).stdout();

    // Run build and keep the built container
    const builtContainer = baseContainer.withExec(["bun", "run", "build"]);
    await builtContainer.stdout();

    // Run tests
    await builtContainer.withExec(["bun", "run", "test"]).stdout();

    // Test examples - use the built container that has dist/ directory
    const examples = ["custom", "preset"];
    for (const example of examples) {
      await builtContainer
        .withWorkdir(`/workspace/examples/${example}`)
        .withExec(["bun", "install"])
        .withExec(["bun", "run", "build"])
        .stdout();
    }

    return "CI pipeline completed successfully";
  }
}
