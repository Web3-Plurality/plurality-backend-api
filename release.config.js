module.exports = {
    branches: ['main'],
    'plugins': [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/npm',
      [
        '@semantic-release/exec',
        {
          'prepareCmd': `
            docker build . --file Dockerfile --tag ghcr.io/web3-plurality/plurality-backend-api:latest \\
            && docker push ghcr.io/web3-plurality/plurality-backend-api:latest \\
            && docker tag ghcr.io/web3-plurality/plurality-backend-api:latest ghcr.io/web3-plurality/plurality-backend-api:\${nextRelease.version} \\
            && docker push ghcr.io/web3-plurality/plurality-backend-api:\${nextRelease.version}
           `
        }
      ],
      '@semantic-release/git',
      '@semantic-release/github'
    ],
    'git': {
      'assets': ['package.json'],
      'message': 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
    }
  };
  