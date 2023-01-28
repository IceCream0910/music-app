import { Card, Grid } from "@nextui-org/react";
import { Home, Search, Folder, Discovery } from 'react-iconly'
import Link from 'next/link'
import { useRouter } from "next/router";

export default function Nav() {
    const router = new useRouter();
    return (
        <>
            <nav className="nav">
                <Card.Body>
                    <Grid.Container justify="space-around">
                        <Grid>
                            <Link href="/" className="clickable">
                                <Home set={router.pathname === '/' ? 'bold' : 'broken'} />
                            </Link>
                        </Grid>
                        <Grid>
                            <Link href="/discover" className="clickable">
                                <Discovery set={router.pathname === '/discover' ? 'bold' : 'broken'} />
                            </Link>
                        </Grid>
                        <Grid>
                            <Link href="/search" className="clickable">
                                <Search set={router.pathname === '/search' ? 'bold' : 'broken'} />
                            </Link>
                        </Grid>
                        <Grid>
                            <Link href="/my" className="clickable">
                                <Folder set={router.pathname === '/my' ? 'bold' : 'broken'} />
                            </Link>
                        </Grid>
                    </Grid.Container>
                </Card.Body>
            </nav>


            <style jsx>{`
                .nav {
                    position:fixed;
                    bottom:0;
                    width:100%;
                    background-color: var(--nextui-colors-backgroundAlpha);
                    -webkit-backdrop-filter: blur(30px);
                    backdrop-filter: blur(30px);
                    z-index:999;
                }
            `}</style>
        </>
    )
}