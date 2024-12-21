# CyCARLA Agent

# Development

[Install uv](https://docs.astral.sh/uv/getting-started/installation/)

```
uv sync
```

```
uv run cycarla-agent
```

# Compiled & Release

```
uv run python -m nuitka --standalone --onefile src/cycarla_agent/__init__.py --output-filename=cycarla_agent_binary
```

Run binary:
```
./cycarla_agent_binary
```

Name this binary with its version number and platform and upload it to Github releases.