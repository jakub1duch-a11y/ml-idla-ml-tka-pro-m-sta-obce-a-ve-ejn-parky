#!/usr/bin/env python3
from pathlib import Path


def validate_skill(skill_path):
    skill_path = Path(skill_path).resolve()
    if not skill_path.exists() or not skill_path.is_dir():
        return False, f"Skill folder is missing: {skill_path}"

    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return False, "SKILL.md is required"

    text = skill_md.read_text(encoding="utf-8").strip()
    if len(text) < 120:
        return False, "SKILL.md is too short"
    if "# " not in text:
        return False, "SKILL.md must contain a top-level title"
    if "use null when unknown" not in text.lower() or "do not infer" not in text.lower():
        return False, "SKILL.md must include the technical-data rule: use null when unknown / do not infer"

    return True, "Skill structure and mandatory technical-data safeguards are valid"
