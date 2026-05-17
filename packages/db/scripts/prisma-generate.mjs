import { spawn } from "node:child_process";

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const args = ["exec", "prisma", "generate"];
const maxAttempts = 3;
const retryDelayMs = 1200;

function isWindowsPrismaLockError(output) {
  return (
    process.platform === "win32" &&
    output.includes("EPERM: operation not permitted, rename") &&
    output.includes("query_engine-windows.dll.node")
  );
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function runPrismaGenerate() {
  let lastExitCode = 1;
  let lastSignal = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const bufferedOutput = [];

    const exitResult = await new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: process.cwd(),
        env: process.env,
        shell: process.platform === "win32",
        stdio: ["inherit", "pipe", "pipe"],
      });

      child.stdout.on("data", (chunk) => {
        const text = chunk.toString();
        bufferedOutput.push(text);
        process.stdout.write(text);
      });

      child.stderr.on("data", (chunk) => {
        const text = chunk.toString();
        bufferedOutput.push(text);
        process.stderr.write(text);
      });

      child.on("error", reject);
      child.on("close", (code, signal) => {
        resolve({
          code: code ?? 1,
          signal,
          output: bufferedOutput.join(""),
        });
      });
    });

    lastExitCode = exitResult.code;
    lastSignal = exitResult.signal;

    if (exitResult.code === 0) {
      return;
    }

    if (
      attempt < maxAttempts &&
      isWindowsPrismaLockError(exitResult.output)
    ) {
      console.warn(
        `Prisma generate hit a Windows file lock. Retrying (${attempt + 1}/${maxAttempts})...`,
      );
      await wait(retryDelayMs);
      continue;
    }

    process.exitCode = exitResult.code;
    return;
  }

  if (lastSignal) {
    process.kill(process.pid, lastSignal);
    return;
  }

  process.exitCode = lastExitCode;
}

await runPrismaGenerate();
