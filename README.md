# setup-mvsc-dev

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square&label=License)](https://github.com/TheMrMilchmann/setup-msvc-dev/blob/master/LICENSE)

A [GitHub Action](https://github.com/features/actions) to set up a Developer
Command Prompt for Microsoft Visual C++.

This project was forked from https://github.com/ilammy/msvc-dev-cmd to support
additional use-cases and to experiment further with GitHub Actions.

## Usage

### Basic Usage

```yaml
steps:
  - uses: actions/checkout@v1
  - uses: TheMrMilchmann/setup-mvsc-dev@v1
    with:
      arch: x64
```

### Inputs

- `arch` – target architecture (required if at least one is set: `sdk`,
           `toolselt`, `uwp`, `spectre`)
  - native compilation:
    - `x64`
    - `x86`
  - cross-compilation: `x86_amd64`, `x86_arm`
  - Check the documentation of 
- `vs-path` – the path to the Visual Studio installation
  - do not specify to use the latest installation
- `sdk` – Windows SDK to use
  - do not specify to use the default SDK
  - or specify full Windows 10 SDK number (e.g. `10.0.10240.0`)
  - or write `8.1` to use Windows 8.1 SDK
- `toolset` – select a VC++ compiler toolset
  - do not specify to use the default toolset
  - `14.0` for VC++ 2015 Compiler Toolset
  - `14.XX` for the latest 14.XX toolset installed (e.g. `14.11`)
  - `14.XX.YYYY` for a specific full version number (e.g. `14.11.25503`)
- `uwp` – set to `true` to build for Universal Windows Platform (i.e., for Windows Store)
- `spectre` – set to `true` to use Visual Studio libraries with spectre mitigations
- `export-path-to-vcvarsall` – the environment variable to store the path to
                               vcvarsall.bat in
- `export-path-to-vs` – the environment variable to store the path to the Visual 
                        Studio installation in


### Versioning

This action is strictly following [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).
Thus, it is recommended to pin the action against specific MAJOR version. This
can be achieved by using the `v${MAJOR}` branch.

To get an overview about the action's versions, see the [changelog](docs/changelog/README.md).


## License

```
Copyright (c) 2019 ilammy
Copyright (c) 2021 Leon Linhart

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```