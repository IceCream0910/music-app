/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [
            {
                source: "/stream/:slug",
                destination: "http://lt2.kr/m/module/fetch_song.php?song=:slug",
            },
        ];
    },
}

module.exports = nextConfig
