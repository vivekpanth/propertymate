import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, Text, StyleSheet, ViewToken, ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoPlayer } from '../../components/video/VideoPlayer';
import { Heart, Share2, MessageCircle, Volume2, VolumeX } from 'lucide-react-native';
import { AreasGallery } from '../areas/AreasGallery';
import { AreasChip } from '../../components/ui/AreasChip';

const { height: screenHeight, width } = Dimensions.get('window');

const MOCK_VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

export const FeedScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const videoHeight = screenHeight - insets.bottom - 140; // Account for tab bar (~60px)
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [areasVisible, setAreasVisible] = useState(false);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const firstVisible = (viewableItems || []).find(v => v.isViewable);
    if (firstVisible && typeof firstVisible.index === 'number') {
      setIndex(firstVisible.index);
    }
  }).current;

  const keyExtractor = useCallback((uri: string) => uri, []);

  const renderItem = useCallback(({ item, index: i }: ListRenderItemInfo<string>) => {
    const autoPlay = i === index;
    return (
      <View style={{ height: videoHeight, width }}>
        <VideoPlayer uri={item} muted={muted} autoPlay={autoPlay} />
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Heart size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <MessageCircle size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Share2 size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setMuted((m) => !m)}>
              {muted ? <VolumeX size={24} color="#fff" /> : <Volume2 size={24} color="#fff" />}
            </TouchableOpacity>
          </View>
          <View style={styles.caption}> 
            <Text style={styles.captionText}>Mock Property • #{i + 1}</Text>
            <AreasChip 
              roomCount={5} 
              onPress={() => setAreasVisible(true)} 
            />
          </View>
        </View>
      </View>
    );
  }, [index, muted, videoHeight]);

  const getItemLayout = useCallback((_: unknown, i: number) => ({ length: videoHeight, offset: videoHeight * i, index: i }), [videoHeight]);

  const data = useMemo(() => MOCK_VIDEOS, []);

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        pagingEnabled
        bounces={false}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialNumToRender={2}
        windowSize={3}
        removeClippedSubviews
      />
      <AreasGallery
        visible={areasVisible}
        onClose={() => setAreasVisible(false)}
        propertyTitle={`Mock Property • #${index + 1}`}
        rooms={[]} // Uses default MOCK_ROOMS from AreasGallery
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  actions: { position: 'absolute', right: 16, bottom: 120, gap: 16, alignItems: 'center' },
  actionBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  caption: { position: 'absolute', left: 16, bottom: 32, right: 16 },
  captionText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
