#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_NAME = 'project-setup';
const MARKER = '.installed-by-project-setup-skill.json';
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const HELP = `project-setup-skill v${pkg.version}

Usage:
  project-setup-skill [install] [options]
  project-setup-skill uninstall [options]

Options:
  -p, --project    install into ./.claude/skills (this project only)
  -d, --dir <path> install into a custom skills directory
  -f, --force      overwrite/remove even if the folder was not created by this tool
  -n, --dry-run    show what would happen, change nothing
  -h, --help       show this help
  -v, --version    show version

Default target: $CLAUDE_CONFIG_DIR/skills or ~/.claude/skills (all projects).
`;

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function parse(argv) {
  const o = { cmd: 'install', project: false, dir: null, force: false, dry: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === 'install' || a === 'uninstall') o.cmd = a;
    else if (a === '-p' || a === '--project') o.project = true;
    else if (a === '-f' || a === '--force') o.force = true;
    else if (a === '-n' || a === '--dry-run') o.dry = true;
    else if (a === '-d' || a === '--dir') {
      o.dir = argv[++i];
      if (!o.dir) fail('--dir requires a path');
    } else if (a === '-h' || a === '--help') o.cmd = 'help';
    else if (a === '-v' || a === '--version') o.cmd = 'version';
    else fail(`Unknown argument: ${a}\n\n${HELP}`);
  }
  return o;
}

function skillsDir(o) {
  if (o.dir) return resolve(o.dir);
  if (o.project) return join(process.cwd(), '.claude', 'skills');
  return join(process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude'), 'skills');
}

function install(o) {
  const dest = join(skillsDir(o), SKILL_NAME);
  const src = join(ROOT, 'skill', SKILL_NAME);
  const ours = existsSync(join(dest, MARKER));
  if (existsSync(dest) && !ours && !o.force) {
    fail(`${dest} exists and wasn't created by this tool. Re-run with --force to overwrite.`);
  }
  console.log(`${existsSync(dest) ? 'Updating' : 'Installing'} ${SKILL_NAME} v${pkg.version} -> ${dest}`);
  if (o.dry) return;
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  writeFileSync(join(dest, MARKER), JSON.stringify({ version: pkg.version }, null, 2) + '\n');
  console.log('Done. Restart your agent session if it was already running.');
}

function uninstall(o) {
  const dest = join(skillsDir(o), SKILL_NAME);
  if (!existsSync(dest)) return console.log(`Nothing to remove at ${dest}`);
  if (!existsSync(join(dest, MARKER)) && !o.force) {
    fail(`${dest} wasn't created by this tool. Re-run with --force to remove it.`);
  }
  console.log(`Removing ${dest}`);
  if (!o.dry) rmSync(dest, { recursive: true, force: true });
}

const o = parse(process.argv.slice(2));
if (o.cmd === 'help') console.log(HELP);
else if (o.cmd === 'version') console.log(pkg.version);
else if (o.cmd === 'uninstall') uninstall(o);
else install(o);
