#!/usr/bin/env python3
"""Extract a single PNG from git."""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
commit, git_path, out = sys.argv[1], sys.argv[2], Path(sys.argv[3])
data = subprocess.run(["git", "show", f"{commit}:{git_path}"], capture_output=True, cwd=ROOT)
if data.returncode != 0:
    raise SystemExit(data.stderr.decode())
out.write_bytes(data.stdout)
print(len(data.stdout), out)
