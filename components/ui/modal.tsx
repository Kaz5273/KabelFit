import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import React from 'react';
import {
  Pressable,
  Modal as RNModal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  type ModalProps as RNModalProps,
} from 'react-native';

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  animationType?: RNModalProps['animationType'];
  fullScreen?: boolean;
};

export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  animationType = 'slide',
  fullScreen = false,
}: ModalProps) {
  const content = (
    <>
      {/* Header */}
      {(title || showCloseButton) && (
        <View style={styles.header}>
          {title && (
            <ThemedText type="subtitle" style={styles.title}>
              {title}
            </ThemedText>
          )}
          {showCloseButton && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="xmark" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Content */}
      {fullScreen ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.body}>{children}</View>
      )}
    </>
  );

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={!fullScreen}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {fullScreen ? (
        <SafeAreaView style={styles.safeAreaFullScreen}>
          <ThemedView style={[styles.content, styles.fullScreenContent]}>
            {content}
          </ThemedView>
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          <Pressable style={styles.backdrop} onPress={onClose} />
          <ThemedView style={styles.content}>
            {content}
          </ThemedView>
        </View>
      )}
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  safeAreaFullScreen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    backgroundColor: Colors.dark.backgroundCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  fullScreenContent: {
    flex: 1,
    borderRadius: 0,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.divider,
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  body: {
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});

