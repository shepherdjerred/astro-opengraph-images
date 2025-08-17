import { dag, func, argument, Directory, object } from "@dagger.io/dagger";

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
    return await dag
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory("/workspace", source)
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "lint"])
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
    return await dag
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory("/workspace", source)
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "build"])
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
    const builtContainer = dag
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory("/workspace", source)
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "build"]);

    // Then test the example using the built container
    return await builtContainer
      .withWorkdir(`/workspace/examples/${example}`)
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "build"])
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
    return await dag
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory("/workspace", source)
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "test"])
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
    const baseContainer = dag
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory("/workspace", source)
      .withExec(["npm", "ci"]);

    // Run lint
    await baseContainer.withExec(["npm", "run", "lint"]).stdout();

    // Run build and keep the built container
    const builtContainer = baseContainer.withExec(["npm", "run", "build"]);
    await builtContainer.stdout();

    // Run tests
    await builtContainer.withExec(["npm", "run", "test"]).stdout();

    // Test examples - use the built container that has dist/ directory
    const examples = ["custom", "preset"];
    for (const example of examples) {
      await builtContainer
        .withWorkdir(`/workspace/examples/${example}`)
        .withExec(["npm", "ci"])
        .withExec(["npm", "run", "build"])
        .stdout();
    }

    return "CI pipeline completed successfully";
  }
}
