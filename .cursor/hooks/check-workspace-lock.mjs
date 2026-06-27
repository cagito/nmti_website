#!/usr/bin/env node
/**
 * Cursor hook — block guarded writes when another session holds a workspace lock.
 * stdin: hook event JSON (beforeShellExecution | preToolUse)
 * stdout: { permission: "allow" | "deny", user_message?, agent_message? }
 */
import { readFileSync } from 'fs';
import { findCrossSessionBlock } from '../../scripts/lib/workspace-lock.mjs';
import { scopesForPath, scopesForShellCommand } from '../../scripts/lib/guarded-paths.mjs';

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

function allow() {
  console.log(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

function deny(userMessage, agentMessage) {
  console.log(
    JSON.stringify({
      permission: 'deny',
      user_message: userMessage,
      agent_message: agentMessage,
    })
  );
  process.exit(0);
}

const input = readStdin();
const hookName = input.hook_event_name || input.event || '';

if (hookName === 'beforeShellExecution' || input.command) {
  const command = String(input.command || '');
  const lower = command.toLowerCase();

  if (
    /lock:status|lock:acquire|lock:release|workspace-lock\.mjs/.test(lower)
  ) {
    allow();
  }

  const scopes = scopesForShellCommand(command);
  if (!scopes.length) allow();

  const block = findCrossSessionBlock(scopes);
  if (block) {
    const { scope, holder } = block;
    deny(
      `다른 Cursor 창이 scope "${scope}" 잠금 중입니다 (${holder.owner}). 해당 창에서 작업을 마치거나 lock:release 후 재시도하세요.`,
      `LOCK-01: Shell blocked. Holder: ${holder.owner}, pid ${holder.pid}, task: ${holder.task || '—'}. Run npm run lock:status. docs/98`
    );
  }
  allow();
}

if (hookName === 'preToolUse' || input.tool_name) {
  const tool = String(input.tool_name || '');
  const toolInput = input.tool_input || input.arguments || {};

  if (!/^(Write|StrReplace|Delete)$/i.test(tool)) allow();

  const path = toolInput.path || toolInput.file_path || toolInput.target_path;
  if (!path) allow();

  const scopes = scopesForPath(String(path));
  if (!scopes.length) allow();

  const block = findCrossSessionBlock(scopes);
  if (block) {
    const { scope, holder } = block;
    deny(
      `파일 "${path}" — 다른 Cursor 창이 "${scope}" 잠금 중 (${holder.owner}). 충돌 방지를 위해 편집이 차단되었습니다.`,
      `LOCK-01: Edit blocked on guarded path. Acquire lock in one window only, or wait for release. docs/98`
    );
  }
  allow();
}

allow();
