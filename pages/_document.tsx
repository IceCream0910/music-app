import {Head, Html, Main, NextScript} from 'next/document'

export default function Document() {
    return (
        <Html lang="ko">
            <Head>
                <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
