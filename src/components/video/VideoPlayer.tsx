import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

type Props = {
  uri: string;
  muted?: boolean;
  autoPlay?: boolean;
  onReady?: (firstFrameMs: number) => void;
  onEnd?: () => void;
};

type Listener = { remove?: () => void };

export const VideoPlayer: React.FC<Props> = ({ uri, muted = true, autoPlay = true, onReady, onEnd }) => {
  const firstLoadAt = useRef<number | null>(null);
  const firedReady = useRef(false);

  const source = useMemo(() => ({ uri }), [uri]);
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = muted;
    if (autoPlay) p.play();
  });

  const addListener = useCallback((eventName: string, cb: () => void): Listener => {
    const p = player as unknown as { addEventListener?: (name: string, cb: () => void) => Listener };
    return p.addEventListener ? p.addEventListener(eventName, cb) : {};
  }, [player]);

  const getCurrentTime = useCallback((): number => {
    const p = player as unknown as { currentTime?: number };
    return typeof p.currentTime === 'number' ? p.currentTime : 0;
  }, [player]);

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useEffect(() => {
    if (autoPlay) player.play();
    else player.pause();
  }, [autoPlay, player]);

  useEffect(() => {
    const loadSub = addListener('loadedmetadata', () => {
      firstLoadAt.current = Date.now();
      firedReady.current = false;
    });
    const endSub = addListener('ended', () => onEnd?.());

    const interval = setInterval(() => {
      if (!firedReady.current && firstLoadAt.current) {
        const t = getCurrentTime();
        if (t > 0) {
          onReady?.(Date.now() - firstLoadAt.current);
          firedReady.current = true;
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      loadSub.remove?.();
      endSub.remove?.();
      try {
        // Guard: on fast unmounts the native object may already be disposed
        (player as unknown as { pause?: () => void }).pause?.();
      } catch {
        // no-op
      }
    };
  }, [onEnd, onReady, player, addListener, getCurrentTime]);

  return <VideoView style={styles.fill} player={player} allowsFullscreen allowsPictureInPicture contentFit="cover" />;
};

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, backgroundColor: 'black' },
});