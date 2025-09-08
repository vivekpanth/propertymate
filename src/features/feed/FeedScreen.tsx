import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, Text, StyleSheet, ViewToken, ListRenderItemInfo, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoPlayer } from '../../components/video/VideoPlayer';
import { Heart, Share2, MessageCircle, Volume2, VolumeX } from 'lucide-react-native';
import { AreasGallery } from '../areas/AreasGallery';
import { AreasChip } from '../../components/ui/AreasChip';
import { useHeroVideos, usePropertyRooms } from '../../hooks/useProperties';
import { PropertyWithMedia } from '../../services/api/properties';

const { height: screenHeight, width } = Dimensions.get('window');

export const FeedScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const videoHeight = screenHeight - insets.bottom - 140; // Account for tab bar (~60px)
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [areasVisible, setAreasVisible] = useState(false);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  // Fetch hero videos from Supabase
  const { data: properties = [], isLoading, error } = useHeroVideos();
  const selectedProperty = (properties as PropertyWithMedia[])[index];
  const rooms = usePropertyRooms(selectedProperty?.id || '');

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const firstVisible = (viewableItems || []).find(v => v.isViewable);
    if (firstVisible && typeof firstVisible.index === 'number') {
      setIndex(firstVisible.index);
    }
  }).current;

  const keyExtractor = useCallback((property: PropertyWithMedia) => property.id, []);

  const renderItem = useCallback(({ item, index: i }: ListRenderItemInfo<PropertyWithMedia>) => {
    const autoPlay = i === index;
    const heroVideo = item.media?.find(m => m.media_type === 'hero');
    const videoUrl = heroVideo?.url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    
    return (
      <View style={{ height: videoHeight, width }}>
        <VideoPlayer uri={videoUrl} muted={muted} autoPlay={autoPlay} />
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
            <Text style={styles.captionText}>{item.title}</Text>
            <AreasChip 
              roomCount={rooms.length || 5} 
              onPress={() => setAreasVisible(true)} 
            />
          </View>
        </View>
      </View>
    );
  }, [index, muted, videoHeight, rooms.length]);

  const getItemLayout = useCallback((_: unknown, i: number) => ({ length: videoHeight, offset: videoHeight * i, index: i }), [videoHeight]);

  const data = useMemo(() => properties as PropertyWithMedia[], [properties]);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#335CFF" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load properties</Text>
        <Text style={styles.errorSubtext}>Please check your connection</Text>
      </View>
    );
  }

  // Empty state
  if ((properties as PropertyWithMedia[]).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No properties available</Text>
        <Text style={styles.emptySubtext}>Check back later for new listings</Text>
      </View>
    );
  }

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
        propertyTitle={selectedProperty?.title || 'Property'}
        rooms={rooms}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});