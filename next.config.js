const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
	output: 'standalone',
	images: {
		domains: ['i.imgur.com'],
	},
}

module.exports = withBundleAnalyzer(nextConfig)
