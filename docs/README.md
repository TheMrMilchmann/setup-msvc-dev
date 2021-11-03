# Developer Guide

## Releasing a new version

This section will walk you through how to create a new release of this action.
Before attempting to create a release please make sure that you are fully
familiar with the project's structure and versioning.

### Before triggering a release

Before triggering a release, the changelog must be written and committed
manually. Generally, the last commit message before a release should be

    chore: prepare X.Y.Z release

where `X.Y.Z` denotes the release version. The commit's content should only touch
the `docs/changelog` directory and

1. finish the changelog for the release (in `X.Y.Z.md`),
2. copy the changelog to the full (`full.md`) and latest (`latest.md`) notes, and
3. update the latest version in `README.md`.


### Triggering a release

Once a release has been prepared, the release process can be started by manually
triggering the "Release" workflow. This workflow will take care of building and
publishing the release on the proper branch and creating the appropriate tag.


### After triggering a release

Afterwards a GitHub release must be created manually for the newly created tag.

Once a release has been finished, the next development cycle should be
prepared by

1. updating the version number in (`package.json`), and
2. preparing a new empty changelog.

Typically, all of this is done in one commit

    chore: bump version number {X.Y.Z =>  x.y.z}

where `x.y.z` denotes the upcoming version. (This doesn't have to be the final
version number for the upcoming version.)