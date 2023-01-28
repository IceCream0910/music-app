//meta tag
import Head from 'next/head'

export default function Meta({ title }) {
    const titleMsg = `${title} | Watermelon`;

    return (
        <Head>
            <title>{titleMsg}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
    )
}