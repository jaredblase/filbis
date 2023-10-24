const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
	images: {
		domains: ['i.imgur.com'],
	},
}

module.exports = withBundleAnalyzer(nextConfig)
