#!/bin/bash

# Generate a version number based on timestamp
VERSION=$(date +'%Y%m%d%H%M%S')

# Write the version to a version file
echo "$VERSION" > version.txt

# Export the version as an environment variable
export REACT_APP_VERSION=$VERSION

# Run the build command
npm run build-prod
