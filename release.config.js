module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    ['@semantic-release/github', {
      assets: [
        'CHANGELOG.md',
        'release/civ6-pbc-db.zip',
        'release/civ6-pbc-api.zip',
        'release/civ6-pbc-ui.zip',
      ],
    }],
    '@semantic-release/git',
  ],
  preset: 'angular',
}
