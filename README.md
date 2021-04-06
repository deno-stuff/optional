# Optional

![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/deno-stuff/optional?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/deno-stuff/optional/build?style=flat-square)
![GitHub](https://img.shields.io/github/license/deno-stuff/optional?style=flat-square)

A TypeScript implementation of Java's `Optional` for Deno.

## Usage

Simply import from deno.land, Github (raw), or any of the available open-source
CDNs (e.g. jsDelivr, cdnjs, unpkg)

    import { Optional } from 'https://deno.land/x/optional@1.0.0/mod.ts'

It is recommended to import the module using a URL with a tag instead of a
branch name. This way, you lock your import to a specific version instead of
whatever's at the tip of the branch.

## Features

- Implemented based on Java 11's version of `Optional`.
- No dependencies.

## Differences

- `stream()` available but not implemented. Will throw an error.
- `hashCode()` available but not implemented. Will throw an error.
- APIs that expect/return super/subclass values not supported yet.

## Notes

[Deno defaults with `--strictNullChecks`
enabled](https://deno.land/manual/typescript/configuration). This
[forces developers to handle `undefined` and `null`
cases](https://www.typescriptlang.org/tsconfig#strictNullChecks) whenever
TypeScript is able to detect them. `Optional` may not be needed unless you're in
it for its API.
