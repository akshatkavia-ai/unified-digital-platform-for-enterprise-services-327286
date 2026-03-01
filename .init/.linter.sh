#!/bin/bash
cd /home/kavia/workspace/code-generation/unified-digital-platform-for-enterprise-services-327286/frontend_web_mobile
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

