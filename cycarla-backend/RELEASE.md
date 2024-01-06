# `cycarla-backend` Release Guidelines

This is a [poetry](https://python-poetry.org/) project and we just follow Poetry's default workflow.

Releasing a new version to pypi can be as simple as: (assuming poetry is authenticated with pypi using API key)

1. Editing `pyproject.toml` to bump the version number.
2. `poetry build`
3. `poetry publish`
