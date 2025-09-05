import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Modal, ListRenderItemInfo } from 'react-native';
import { VideoPlayer } from '../../components/video/VideoPlayer';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../utils/haptics';


export interface Room {
  id: string;
  name: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

interface AreasGalleryProps {
  visible: boolean;
  onClose: () => void;
  propertyTitle: string;
  rooms: Room[];
}

const MOCK_ROOMS: Room[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 'living',
    name: 'Living Room',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  },
  {
    id: 'balcony',
    name: 'Balcony',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
];

export const AreasGallery: React.FC<AreasGalleryProps> = ({ visible, onClose, propertyTitle, rooms }) => {
  const { colors, typography } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use MOCK_ROOMS if no rooms provided or empty array
  const roomsToUse = rooms && rooms.length > 0 ? rooms : MOCK_ROOMS;
  const currentRoom = roomsToUse[currentIndex];

  // Debug logging
  console.log('AreasGallery render:', { visible, roomsLength: roomsToUse.length, currentIndex, currentRoom });

  const handleClose = useCallback(() => {
    haptics.light();
    onClose();
  }, [onClose]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      haptics.light();
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < roomsToUse.length - 1) {
      haptics.light();
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, roomsToUse.length]);

  const handleRoomSelect = useCallback((index: number) => {
    haptics.selection();
    setCurrentIndex(index);
  }, []);

  const renderRoomChip = useCallback(({ item, index }: ListRenderItemInfo<Room>) => {
    const isActive = index === currentIndex;
    return (
      <TouchableOpacity
        style={[
          styles.roomChip,
          { backgroundColor: isActive ? colors.primary : 'rgba(255,255,255,0.2)' },
        ]}
        onPress={() => handleRoomSelect(index)}
      >
        <Text style={[styles.roomChipText, { color: isActive ? '#fff' : '#fff' }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }, [currentIndex, colors.primary, handleRoomSelect]);

  const keyExtractor = useCallback((room: Room) => room.id, []);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.propertyTitle, typography.h3, { color: '#fff' }]}>
              {propertyTitle}
            </Text>
            <Text style={[styles.roomTitle, typography.body, { color: '#fff' }]}>
              {currentRoom?.name}
            </Text>
          </View>
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, { opacity: currentIndex > 0 ? 1 : 0.3 }]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, { opacity: currentIndex < roomsToUse.length - 1 ? 1 : 0.3 }]}
              onPress={handleNext}
              disabled={currentIndex === roomsToUse.length - 1}
            >
              <ChevronRight size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Player */}
        <View style={styles.videoContainer}>
          {currentRoom ? (
            <VideoPlayer
              uri={currentRoom.videoUrl}
              muted={false}
              autoPlay={true}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Loading room video...</Text>
            </View>
          )}
        </View>

        {/* Room Chips */}
        <View style={[styles.chipsContainer, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
          <FlatList
            data={roomsToUse}
            renderItem={renderRoomChip}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContent}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  propertyTitle: {
    color: '#fff',
    textAlign: 'center',
  },
  roomTitle: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  chipsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  chipsContent: {
    gap: 12,
  },
  roomChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  roomChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
  },
});
