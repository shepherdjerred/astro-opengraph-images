import { dag, Container } from "@dagger.io/dagger";

/**
 * Get a base Bun container
 * @returns A Bun container with basic setup
 */
export function getBunContainer(): Container {
  return dag.container().from("oven/bun:latest").withWorkdir("/workspace");
}

/**
 * Get a system container (Ubuntu) with basic tools
 * @returns An Ubuntu container with basic tools
 */
export function getSystemContainer(): Container {
  return dag.container().from("ubuntu:jammy").withWorkdir("/workspace");
}

/**
 * Get a container with GitHub CLI installed
 * @returns A container with GitHub CLI for deployment tasks
 */
export function getGitHubContainer(): Container {
  const ghVersion = "2.63.2";
  return dag
    .container()
    .from("ubuntu:noble")
    .withExec(["apt", "update"])
    .withExec(["apt", "install", "-y", "git", "curl"])
    .withExec([
      "sh",
      "-c",
      `curl -L -o ghcli.deb https://github.com/cli/cli/releases/download/v${ghVersion}/gh_${ghVersion}_linux_amd64.deb`,
    ])
    .withExec(["dpkg", "-i", "ghcli.deb"])
    .withExec(["rm", "ghcli.deb"])
    .withExec(["git", "config", "--global", "user.name", "scout-for-lol"])
    .withExec(["git", "config", "--global", "user.email", "github@sjer.red"])
    .withWorkdir("/workspace");
}
