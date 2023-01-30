import { Loading } from "@nextui-org/react";
import { useRecoilState } from 'recoil';
import { loadingState } from '../../states/states';

export default function Loader({ state }) {
    const [loading, setLoading] = useRecoilState(loadingState);
    return (
        <>
            {loading === true &&
                <div className="loader">
                    <Loading />
                </div>
            }
            <style jsx>{`
                .loader {
                    position:fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index:9999;
                }
            `}</style>
        </>
    )
}