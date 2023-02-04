import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {useRecoilState} from 'recoil';
import {playerState, loadingState, currentSongIdState} from '../../states/states';
import IonIcon from '@reacticons/ionicons';
import {Button, Text, Spacer} from '@nextui-org/react';
import {BottomSheet} from 'react-spring-bottom-sheet'
import toast, {Toaster} from 'react-hot-toast';

export default function Playlist({isOpen}) {
    const router = useRouter();
    const [player, setPlayer] = useRecoilState(playerState);
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);

    const loadData = async (id) => {
        setLoading(true);
        const res = await fetch(`/api/music?id=${id}`);
        const data = await res.json();
        if (data.ok) {
            setData(data.data);
        } else {
            alert(data.message || '오류가 발생했어요');
        }
        setLoading(false);
    };

    return (
        <div>
           
            <Toaster/>
        </div>
    )

};