import { argument, dag, Directory, func, object } from "@dagger.io/dagger";
import type { Container } from "@dagger.io/dagger";

const NODE_IMAGE = "node:22-bookworm";
const WORKDIR = "/workspace";
const NPM_CACHE = "astro-opengraph-images-npm-cache";
const ROOT_NODE_MODULES_CACHE = "astro-opengraph-images-root-node-modules";
const exampleNodeModulesCache = (example: string) => `astro-opengraph-images-example-${example}-node-modules`;

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
    const deps = this.installDependencies(source);
    return await deps.withExec(["npm", "run", "lint"]).stdout();
  }

  /**
   * Build the project
   */
  @func()
  async build(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    const build = this.buildRoot(source);
    return await build.stdout();
  }

  /**
   * Run unit tests
   */
  @func()
  async test(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    const deps = this.installDependencies(source);
    return await deps.withExec(["npm", "run", "test"]).stdout();
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
    const build = this.buildRoot(source);
    await build.stdout();
    await this.runExampleWithBase(example, build);
    return `Example ${example} built successfully.`;
  }

  /**
   * Test all examples (equivalent to the original test.all target)
   */
  @func()
  async testAll(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    const examples = await this.exampleNames(source);
    const build = this.buildRoot(source);
    await build.stdout();

    for (const example of examples) {
      await this.runExampleWithBase(example, build);
    }

    const exampleList = examples.join(", ");
    return `All ${examples.length.toString()} examples built successfully: ${exampleList}`;
  }

  /**
   * Run the complete CI pipeline
   */
  @func()
  async ci(
    @argument({ defaultPath: "." })
    source: Directory,
  ): Promise<string> {
    const deps = this.installDependencies(source);

    await deps.withExec(["npm", "run", "lint"]).stdout();

    const build = deps.withExec(["npm", "run", "build"]);
    await build.stdout();

    await deps.withExec(["npm", "run", "test"]).stdout();

    const examples = await this.exampleNames(source);
    for (const example of examples) {
      await this.runExampleWithBase(example, build);
    }

    const exampleList = examples.join(", ");
    return `CI pipeline completed successfully. Tested ${examples.length.toString()} examples: ${exampleList}`;
  }

  private base(source: Directory): Container {
    return dag
      .container()
      .from(NODE_IMAGE)
      .withWorkdir(WORKDIR)
      .withEnvVariable("CI", "true")
      .withDirectory(WORKDIR, source, {
        exclude: ["node_modules", "examples/*/node_modules", "**/.astro", "**/.dagger"],
      });
  }

  private installDependencies(source: Directory): Container {
    return this.base(source)
      .withMountedCache("/root/.npm", dag.cacheVolume(NPM_CACHE))
      .withMountedCache(`${WORKDIR}/node_modules`, dag.cacheVolume(ROOT_NODE_MODULES_CACHE))
      .withExec(["npm", "ci"]);
  }

  private buildRoot(source: Directory): Container {
    return this.installDependencies(source).withExec(["npm", "run", "build"]);
  }

  private async exampleNames(source: Directory): Promise<string[]> {
    const examplesDir = source.directory("examples");
    const entries = await examplesDir.entries();
    return entries.filter((entry) => entry.trim().length > 0).sort();
  }

  private async runExampleWithBase(example: string, base: Container): Promise<void> {
    const exampleWorkdir = `${WORKDIR}/examples/${example}`;
    let container = base
      .withWorkdir(exampleWorkdir)
      .withMountedCache("/root/.npm", dag.cacheVolume(NPM_CACHE))
      .withMountedCache(`${exampleWorkdir}/node_modules`, dag.cacheVolume(exampleNodeModulesCache(example)))
      .withExec(["npm", "ci"]);

    container = container.withExec(["npm", "run", "build"]);

    await container.stdout();
  }
}
