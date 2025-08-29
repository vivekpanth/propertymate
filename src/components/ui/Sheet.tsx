import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';

export const Sheet: React.FC<{ visible: boolean; onClose: () => void; children: React.ReactNode }>=({ visible, onClose, children })=>{
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
});



