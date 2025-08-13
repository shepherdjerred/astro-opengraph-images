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
    return await dag
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory("/workspace", source)
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "build"])
      .withWorkdir(`/workspace/examples/${example}`)
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "build"])
      .stdout();
  }

  /**
   * Test all examples (equivalent to the original test.all target)
   */
  @func()
  async testAll(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    const container = dag
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory("/workspace", source)
      .withExec(["npm", "ci"])
      .withExec(["npm", "run", "build"]);

    // Get list of example directories
    const exampleDirs = await container
      .withExec(["ls", "-1", "examples"])
      .stdout();

    const examples = exampleDirs.trim().split("\n").filter((dir: string) => dir.trim());
    
    // Test each example
    for (const example of examples) {
      await container
        .withWorkdir(`/workspace/examples/${example}`)
        .withExec(["npm", "ci"])
        .withExec(["npm", "run", "build"])
        .stdout();
    }

    return `All ${examples.length} examples tested successfully: ${examples.join(", ")}`;
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
    const container = dag
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory("/workspace", source)
      .withExec(["npm", "ci"]);

    // Run lint
    await container.withExec(["npm", "run", "lint"]).stdout();

    // Run build
    await container.withExec(["npm", "run", "build"]).stdout();

    // Run tests
    await container.withExec(["npm", "run", "test"]).stdout();

    // Test all examples dynamically
    const exampleDirs = await container
      .withExec(["ls", "-1", "examples"])
      .stdout();

    const examples = exampleDirs.trim().split("\n").filter((dir: string) => dir.trim());

    for (const example of examples) {
      await container
        .withWorkdir(`/workspace/examples/${example}`)
        .withExec(["npm", "ci"])
        .withExec(["npm", "run", "build"])
        .stdout();
    }

    return `CI pipeline completed successfully. Tested ${examples.length} examples: ${examples.join(", ")}`;
  }
}
