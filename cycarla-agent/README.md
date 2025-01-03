# CyCARLA Agent

# Development

[Install uv](https://docs.astral.sh/uv/getting-started/installation/)

```
uv sync
```

Install `cycarla-agent` as executable in editable mode:
```
uv pip install -e .
```

```
uv run cycarla-agent
```

# Compiled & Release

```
uv run python -m nuitka --standalone --onefile src/cycarla_agent/__init__.py --output-filename=cycarla_agent
```

Run binary:
```
./cycarla_agent
```

Name this binary with its version number and platform and upload it to Github releases.