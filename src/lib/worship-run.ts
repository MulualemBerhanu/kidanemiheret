import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const projectRoot = process.cwd();

function parseScriptOutput(stdout: string, stderr: string) {
  const chunks = [...stdout.trim().split("\n"), ...stderr.trim().split("\n")].filter(Boolean);

  for (let i = chunks.length - 1; i >= 0; i--) {
    try {
      const parsed = JSON.parse(chunks[i]!) as { ok?: boolean; error?: string };
      if (parsed.error) return parsed.error;
      if (parsed.ok === false && parsed.error) return parsed.error;
    } catch {
      /* not JSON */
    }
  }

  const lastStderrLine = stderr.trim().split("\n").filter(Boolean).pop();
  if (lastStderrLine && !lastStderrLine.startsWith("Command failed")) {
    return lastStderrLine;
  }

  return null;
}

async function runScript(scriptName: string, args: string[] = []) {
  const scriptPath = path.join(projectRoot, "scripts", scriptName);

  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [scriptPath, ...args], {
      cwd: projectRoot,
      maxBuffer: 20 * 1024 * 1024,
      env: { ...process.env, NODE_ENV: process.env.NODE_ENV ?? "development" },
    });

    const line = stdout.trim().split("\n").pop();
    if (!line) {
      const parsedError = parseScriptOutput(stdout, stderr);
      throw new Error(parsedError ?? "Script returned no output");
    }

    const data = JSON.parse(line) as { ok?: boolean; error?: string };
    if (data.ok === false) {
      throw new Error(data.error ?? "Script failed");
    }

    return data;
  } catch (err) {
    const execErr = err as NodeJS.ErrnoException & { stdout?: string; stderr?: string };
    const stdout = execErr.stdout ?? "";
    const stderr = execErr.stderr ?? "";
    const parsedError = parseScriptOutput(stdout, stderr);

    if (parsedError) {
      throw new Error(parsedError);
    }

    if (err instanceof Error && !err.message.startsWith("Command failed:")) {
      throw err;
    }

    throw new Error("Slide conversion failed. Try exporting as PDF and uploading again.");
  }
}

export async function syncWorshipUploads() {
  return runScript("sync-worship-uploads.mjs");
}

export async function convertWorshipPdf(relativeUploadPath: string) {
  return runScript("convert-worship-api.mjs", [relativeUploadPath]);
}

export function getUploadsDir() {
  return path.join(projectRoot, "public/worship-slides/uploads");
}

const UPLOAD_EXTENSIONS = [".pdf", ".ppt", ".pptx"];

export function isSupportedUpload(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return UPLOAD_EXTENSIONS.includes(ext);
}
