import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatusSuccess } from 'expo-av';

type Props = {
  uri: string;
  muted?: boolean;
  autoPlay?: boolean;
  onReady?: (firstFrameMs: number) => void;
  onEnd?: () => void;
};

export const VideoPlayer: React.FC<Props> = ({ uri, muted=true, autoPlay=true, onReady, onEnd }) => {
  const ref = useRef<Video | null>(null);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      ref.current?.unloadAsync().catch(() => undefined);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={(r) => (ref.current = r)}
        style={StyleSheet.absoluteFill}
        source={{ uri }}
        resizeMode={ResizeMode.COVER}
        isMuted={muted}
        shouldPlay={autoPlay}
        isLooping
        onLoadStart={() => setLoadedAt(Date.now())}
        onReadyForDisplay={() => {
          if (loadedAt && onReady) onReady(Date.now() - loadedAt);
        }}
        onPlaybackStatusUpdate={(status) => {
          const s = status as AVPlaybackStatusSuccess;
          if (s.didJustFinish) onEnd?.();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
});
